# apps/cart/serializers.py
from rest_framework import serializers

class ProductRequestSerializer(serializers.Serializer):
    """
    Serializer for individual product items in the incoming cart request.
    """
    productId = serializers.CharField(max_length=255, help_text="ID of the product being purchased.")
    price = serializers.FloatField(min_value=0.0, help_text="Price per unit of the product.")
    quantity = serializers.IntegerField(min_value=1, help_text="Quantity of the product requested.")
    discount = serializers.FloatField(min_value=0.0, help_text="Discount amount for the product.")

class CustomerDataSerializer(serializers.Serializer):
    """
    Serializer for customer and shipping data in the incoming cart request.
    """
    name = serializers.CharField(max_length=255, help_text="Customer's full name.")
    shipping_street = serializers.CharField(max_length=255, help_text="Shipping street address.")
    commune = serializers.CharField(max_length=255, help_text="Shipping commune.")
    phone = serializers.CharField(max_length=20, help_text="Customer's phone number.")

class CartPurchaseSerializer(serializers.Serializer):
    """
    Main serializer for the entire cart purchase request payload.
    """
    products = ProductRequestSerializer(many=True, help_text="List of products to purchase.")
    customer_data = CustomerDataSerializer(help_text="Customer and shipping details.")