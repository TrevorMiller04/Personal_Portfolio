-- Fact table: Sales aggregated by month
-- This model provides monthly sales metrics for reporting

SELECT 
    order_month_start,
    order_year,
    order_month,
    COUNT(DISTINCT order_id) as total_orders,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(quantity) as total_quantity_sold,
    SUM(total_amount) as total_revenue,
    ROUND(AVG(total_amount), 2) as avg_order_value,
    ROUND(SUM(total_amount) / COUNT(DISTINCT customer_id), 2) as revenue_per_customer

FROM {{ ref('stg_orders') }}
GROUP BY 
    order_month_start,
    order_year,
    order_month
ORDER BY 
    order_month_start