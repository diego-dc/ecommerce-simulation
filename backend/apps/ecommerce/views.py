# apps/cart/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import math
import os

from apps.ecommerce.serializers import CartPurchaseSerializer

FLAPP_API_KEY_UDER = os.getenv("FLAPP_API_KEY_UDER")
FLAPP_API_KEY_TRAELO_YA = os.getenv("FLAPP_API_KEY_TRAELO_YA")

class CartPurchaseAPIView(APIView):
    """
    Handles the purchase simulation for the e-commerce cart.
    """
    def post(self, request, *args, **kwargs):
        serializer = CartPurchaseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract validated data
        products_requested = serializer.validated_data['products'] # type: ignore
        customer_data = serializer.validated_data['customer_data'] # type: ignore

        # 1. Get all products from dummyjson.com with pagination
        #    (Simulating DB query)
        all_dummy_products = self._get_all_dummy_products()

        # 2. Process requested products: get name, stock, rating, calculate Sr
        processed_products = []
        for item in products_requested:
            product_id = str(item['productId']) # Ensure ID is string for lookup
            matched_product = next((p for p in all_dummy_products if str(p['id']) == product_id), None)

            if not matched_product:
                return Response(
                    {"error": f"Product with ID {product_id} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            st = matched_product.get('stock', 0)
            r = matched_product.get('rating', 1) # Default rating to 1 to avoid division by zero
            sr = math.floor(st / r) if r > 0 else 0 # Calculate Sr, handle r=0

            processed_products.append({
                "id": product_id,
                "name": matched_product.get('title', 'N/A'),
                "price_per_unit": item['price'],
                "total_discount": item['discount'], # This is discount *per item*, not total for the product
                "quantity_requested": item['quantity'],
                "stock_obtained": st,
                "rating": r,
                "stock_real": sr,
            })
            
            # Print to console (Requirement d)
            print(f"--- Product ID: {product_id} ---")
            print(f"Name: {matched_product.get('title', 'N/A')}")
            print(f"Price per unit: {item['price']}")
            print(f"Total discount: {item['discount']}") # Assuming this is the discount amount for the item
            print(f"Quantity requested: {item['quantity']}")
            print(f"Stock obtained (St): {st}")
            print(f"Rating (r): {r}")
            print(f"Stock real (Sr): {sr}")
            print("-" * 20)

        # 3. Verify stock (Requirement e)
        for product in processed_products:
            if product['quantity_requested'] > product['stock_real']:
                return Response(
                    {"error": f"Insufficient stock for product '{product['name']}' (ID: {product['id']}). "
                               f"Requested: {product['quantity_requested']}, Available (Sr): {product['stock_real']}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 4. Tarification a couriers (Requirement f)
        courier_origin_data = {
            "name": "Tienda Flapp",
            "phone": "+569 1234 5678",
            "address": "Juan de Valiente 3630",
            "commune": "Vitacura"
        }
        
        # Pass processed_products to courier methods for item details
        traelo_ya_price = self._get_traelo_ya_price(customer_data, courier_origin_data, processed_products)
        uder_price = self._get_uder_price(customer_data, courier_origin_data, processed_products)

        print("\n--- Courier Tarification Responses ---")
        print(f"TraeloYa Price: {traelo_ya_price}")
        print(f"Uder Price: {uder_price}")
        print("-" * 20)

        # 5. Get the lowest price and return (Requirement g)
        best_price = float('inf')
        best_courier = None

        if traelo_ya_price is not None and traelo_ya_price < best_price:
            best_price = traelo_ya_price
            best_courier = "TraeloYa"

        if uder_price is not None and uder_price < best_price:
            best_price = uder_price
            best_courier = "Uder"
        
        if best_courier is None:
            return Response(
                {"error": "Could not obtain shipping prices from couriers. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "price": best_price,
            "courier": best_courier
        }, status=status.HTTP_200_OK)


    def _get_all_dummy_products(self):
        """
        Fetches all products from dummyjson.com using pagination (10 by 10).
        """
        all_products = []
        limit = 10
        skip = 0
        total_products = -1

        print("\n--- Fetching products from dummyjson.com ---")
        while total_products == -1 or skip < total_products:
            url = f"https://dummyjson.com/products?limit={limit}&skip={skip}"
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                products = data.get('products', [])
                total = data.get('total', 0)

                if total_products == -1: # Set total_products on first successful call
                    total_products = total

                all_products.extend(products)
                skip += limit

                print(f"Fetched {len(products)} products (Total so far: {len(all_products)} / {total_products})...")
                
                if not products: # Break if no more products are returned but total_products isn't updated
                    break

            except requests.exceptions.RequestException as e:
                print(f"Error fetching products from dummyjson.com: {e}")
                # Decide how to handle this error: raise, return partial, or return error response
                raise # Re-raise to be caught by the main view method

        print(f"Finished fetching {len(all_products)} products from dummyjson.com.")
        return all_products

    def _get_traelo_ya_price(self, customer_data, origin_data, products_list):
        """
        Calls TraeloYa API for pricing.
        """
        url = "https://recruitment.weflapp.com/tarifier/traelo_ya"
        headers = {"X-Api-Key": FLAPP_API_KEY_TRAELO_YA}

        # Build 'items' payload
        items_payload = []
        for product in products_list:
            items_payload.append({
                "quantity": product['quantity_requested'],
                "value": product['price_per_unit'],
                "volume": product['volume_per_unit'] * product['quantity_requested'] # Total volume for all units of this product
            })

        payload = {
            "items": items_payload,
            "waypoints": [
                {
                    "type": "PICK_UP",
                    "addressStreet": origin_data['addressStreet'],
                    "city": origin_data['city'],
                    "phone": origin_data['phone'],
                    "name": origin_data['name']
                },
                {
                    "type": "DROP_OFF",
                    "addressStreet": customer_data['shipping_street'],
                    "city": customer_data['commune'],
                    "phone": customer_data['phone'],
                    "name": customer_data['name']
                }
            ]
        }

        print(f"DEBUG: Calling TraeloYa API with payload: {payload}")
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
            
            response_json = response.json()
            if "error" in response_json:
                print(f"TraeloYa API returned error: {response_json['error']}")
                return None
            
            # Navigate to the total price
            return response_json.get('deliveryOffers', {}).get('pricing', {}).get('total')
        
        except requests.exceptions.RequestException as e:
            print(f"Error calling TraeloYa API: {e}")
            return None # Indicate failure to get price

    def _get_uder_price(self, customer_data, origin_data, products_list):
        """
        Calls Uder API for pricing.
        """
        url = "https://recruitment.weflapp.com/tarifier/uder"
        headers = {"X-Api-Key": FLAPP_API_KEY_UDER}

        # Build 'manifest_items' payload
        manifest_items_payload = []
        for product in products_list:
            manifest_items_payload.append({
                "name": product['name'],
                "quantity": product['quantity_requested'],
                "price": product['price_per_unit'],
                "dimensions": product['dimensions_per_unit'] # Use the dummy dimensions
            })

        payload = {
            "pickup_address": origin_data['addressStreet'],
            "pickup_name": origin_data['name'],
            "pickup_phone_number": origin_data['phone'],
            "dropoff_address": customer_data['shipping_street'],
            "dropoff_name": customer_data['name'],
            "dropoff_phone_number": customer_data['phone'],
            "manifest_items": manifest_items_payload
        }

        print(f"DEBUG: Calling Uder API with payload: {payload}")
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
            
            response_json = response.json()
            if "error" in response_json:
                print(f"Uder API returned error: {response_json['error']}")
                return None
            
            return response_json.get('fee')
        
        except requests.exceptions.RequestException as e:
            print(f"Error calling Uder API: {e}")
            return None # Indicate failure to get price
