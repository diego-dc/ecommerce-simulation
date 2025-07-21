# apps/cart/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests # For making HTTP requests to dummyjson.com and couriers
import math # For floor division

from apps.ecommerce.serializers import CartPurchaseSerializer

class CartPurchaseAPIView(APIView):
    """
    Handles the purchase simulation for the e-commerce cart.
    """
    def post(self, request, *args, **kwargs):
        serializer = CartPurchaseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract validated data
        products_requested = serializer.validated_data['products']
        customer_data = serializer.validated_data['customer_data']

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
                "stock_real": sr
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

        # NOTE: Implement actual courier API calls here
        # For now, let's simulate responses based on the "Tarificación de Envíos" document
        # You'll replace this with actual HTTP requests to TraeloYa and Uder.

        # Placeholder for TraeloYa and Uder responses - YOU MUST IMPLEMENT THIS
        # Based on the "Tarificación de Envíos" document, you'll construct the
        # specific request body for each courier and make the actual API calls.
        # This is a critical part you'll need to fill in.
        
        traelo_ya_price = self._get_traelo_ya_price(customer_data, courier_origin_data)
        uder_price = self._get_uder_price(customer_data, courier_origin_data)

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
                {"error": "Could not obtain shipping prices from couriers."},
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
        total_products = -1 # Sentinel value to start loop

        print("\n--- Fetching products from dummyjson.com ---")
        while total_products == -1 or skip < total_products:
            url = f"https://dummyjson.com/products?limit={limit}&skip={skip}"
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
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

    def _get_traelo_ya_price(self, customer_data, origin_data):
        """
        Simulates calling TraeloYa API for pricing.
        YOU MUST REPLACE THIS WITH ACTUAL API CALL LOGIC.
        """
        # Placeholder: This is where you'd make an actual HTTP POST request to TraeloYa.
        # Construct the request body according to TraeloYa's documentation.
        print(f"DEBUG: Simulating TraeloYa call with customer_data: {customer_data}, origin_data: {origin_data}")
        # Example of what you might send:
        # traelo_ya_payload = {
        #     "origin": {
        #         "address": origin_data['address'],
        #         "commune": origin_data['commune'],
        #         "contact_name": origin_data['name'],
        #         "phone": origin_data['phone']
        #     },
        #     "destination": {
        #         "address": customer_data['shipping_street'],
        #         "commune": customer_data['commune'],
        #         "contact_name": customer_data['name'],
        #         "phone": customer_data['phone']
        #     },
        #     "packages": [...] # Details about products if needed by courier for weight/dimensions
        # }
        # try:
        #     response = requests.post("https://traeloya.com/api/tarifar", json=traelo_ya_payload, timeout=5)
        #     response.raise_for_status()
        #     return response.json().get('price')
        # except requests.exceptions.RequestException as e:
        #     print(f"Error calling TraeloYa API: {e}")
        #     return None # Indicate failure to get price
        
        # For now, return a dummy price
        return 5.50 # Example dummy price

    def _get_uder_price(self, customer_data, origin_data):
        """
        Simulates calling Uder API for pricing.
        YOU MUST REPLACE THIS WITH ACTUAL API CALL LOGIC.
        """
        # Placeholder: This is where you'd make an actual HTTP POST request to Uder.
        # Construct the request body according to Uder's documentation.
        print(f"DEBUG: Simulating Uder call with customer_data: {customer_data}, origin_data: {origin_data}")
        # Example of what you might send:
        # uder_payload = {
        #     "from_address": origin_data['address'],
        #     "from_commune": origin_data['commune'],
        #     "to_address": customer_data['shipping_street'],
        #     "to_commune": customer_data['commune'],
        #     "customer_phone": customer_data['phone'],
        #     "items": [...] # Product details
        # }
        # try:
        #     response = requests.post("https://uder.cl/api/calculate_shipping", json=uder_payload, timeout=5)
        #     response.raise_for_status()
        #     return response.json().get('cost')
        # except requests.exceptions.RequestException as e:
        #     print(f"Error calling Uder API: {e}")
        #     return None # Indicate failure to get price

        # For now, return a dummy price
        return 7.25 # Example dummy price