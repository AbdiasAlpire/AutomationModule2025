# Exercise 1: Retrieve all columns from the yourls_url table.

CREATE PROCEDURE get_all_columns()
BEGIN
    SELECT * FROM yourls_url;
END 


# Exercise 2: Return only the first row. (Use hardcoded data)

CREATE PROCEDURE get_first_row()
BEGIN
    SELECT * FROM yourls_url LIMIT 1;
END


# Exercise 3: Search for records by a specific keyword. (Hardcode a keyword)

CREATE PROCEDURE get_by_keyword(IN kw VARCHAR(50))
BEGIN
    SELECT * FROM yourls_url WHERE keyword = kw;
END


# Exercise 4: Filter records within a range of timestamps. (Hardcode sample timestamps)

CREATE PROCEDURE get_by_timestamp_range(
    IN start_ts DATETIME,
    IN end_ts DATETIME
)
BEGIN
    SELECT * FROM yourls_url WHERE timestamp BETWEEN start_ts AND end_ts;
END


# Exercise 5: Verify that keyword is the primary key.

CREATE PROCEDURE verify_primary_key()
BEGIN
    SHOW KEYS FROM yourls_url WHERE Key_name = 'PRIMARY';
END


# Exercise 6: Return all records where clicks > 10. (Hardcode sample clicks)

CREATE PROCEDURE get_clicks_gt(IN min_clicks INT)
BEGIN
    SELECT * FROM yourls_url WHERE clicks > min_clicks;
END


# Exercise 7: Count the number of records for each IP address. (Hardcode sample IPs)

CREATE PROCEDURE count_by_ip()
BEGIN
    SELECT ip, COUNT(*) AS total FROM yourls_url GROUP BY ip;
END


