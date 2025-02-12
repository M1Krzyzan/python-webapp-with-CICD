import os
from datetime import datetime
from typing import List

import stripe
from dependency_injector.wiring import inject, Provide
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException

from application.auth.auth_service import AuthService
from application.order.order_service import OrderService
from application.requests import OrderRequest
from application.responses import OrderSummaryForRegionResponse
from infrastructure.containers import Container

order_router = APIRouter()
load_dotenv()
FRONTEND_URL = os.getenv("REACT_APP_URL")
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
SUCCESS_URL = f"{FRONTEND_URL}/success"


@order_router.post("/purchase", dependencies=[Depends(AuthService.verify_jwt_token)])
@inject
async def add_order_endpoint(
    order: OrderRequest,
    order_service: OrderService = Depends(Provide[Container.order_service]),
):
    """
    Create a new Stripe Checkout Session and redirect the user to the session URL.
    """
    try:
        # Map products from the order into Stripe line items
        line_items = [
            {
                "price_data": {
                    "currency": "pln",  # Adjust this to your desired currency
                    "product_data": {"name": product["name"]},
                    "unit_amount": int(product["price"] * 100),  # Amount in cents
                },
                "quantity": product["quantity"],
            }
            for product in order.products
        ]

        # Create a checkout session
        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_URL}/success",
            cancel_url=f"{FRONTEND_URL}/checkout",
            customer_email=order.email,
        )
    except Exception as e:
        # Return an HTTPException with a 400 status code and error message
        raise HTTPException(status_code=400, detail=str(e))

    # Save the order in your system
    order_response = order_service.add_order(order)
    # Redirect to the checkout session URL
    return {"url": checkout_session.url, "order": order_response}


@order_router.get(
    "/orders/stats",
    dependencies=[Depends(AuthService.is_admin)],
    response_model=List[OrderSummaryForRegionResponse],
)
@inject
async def admin_stats(
    start_date: datetime,
    end_date: datetime,
    order_service: OrderService = Depends(Provide[Container.order_service]),
) -> List[OrderSummaryForRegionResponse]:
    return order_service.get_orders_report_for_period(start_date, end_date)


@order_router.get(
    "/orders/{order_id}",
    response_model=dict,
    dependencies=[Depends(AuthService.is_admin)],
)
@inject
async def get_order(
    order_id: str,
    order_service: OrderService = Depends(Provide[Container.order_service]),
) -> dict:
    return {"order": order_service.get_order_by_id(order_id)}


@order_router.get(
    "/orders", response_model=dict, dependencies=[Depends(AuthService.is_admin)]
)
@inject
async def get_all_orders(
    order_service: OrderService = Depends(Provide[Container.order_service]),
) -> dict:
    return {"orders": order_service.get_orders()}


@order_router.put(
    "/orders/{order_id}/complete",
    response_model=dict,
    dependencies=[Depends(AuthService.verify_jwt_token)],
)
@inject
async def set_order_status_complete(
    order_id: str,
    order_service: OrderService = Depends(Provide[Container.order_service]),
) -> dict:
    return {"order": order_service.mark_order_as_complete(order_id)}


@order_router.get(
    "/checkout",
    response_model=dict,
    dependencies=[Depends(AuthService.verify_jwt_token)],
)
@inject
async def get_unavailable_dates(
    order_service: OrderService = Depends(Provide[Container.order_service]),
) -> dict:
    return {"dates": order_service.get_list_of_unavailable_dates()}
