from django.urls import path
from apps.ecommerce.views import CartPurchaseAPIView

app_name = "ecommerce"

urlpatterns = [
    path('cart/', CartPurchaseAPIView.as_view(), name='purchase-cart'),
]