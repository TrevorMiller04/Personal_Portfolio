-- Staging model for orders data
-- This model cleans and standardizes the raw orders data

WITH raw_orders AS (
    SELECT 
        order_id,
        customer_id,
        order_date::DATE as order_date,
        category,
        product_name,
        quantity::INTEGER as quantity,
        unit_price::DECIMAL(10,2) as unit_price,
        total_amount::DECIMAL(10,2) as total_amount,
        region,
        -- Add derived fields
        EXTRACT(year FROM order_date::DATE) as order_year,
        EXTRACT(month FROM order_date::DATE) as order_month,
        DATE_TRUNC('month', order_date::DATE) as order_month_start
    FROM {{ ref('raw_orders') }}
    WHERE order_id IS NOT NULL
      AND total_amount > 0
)

SELECT * FROM raw_orders