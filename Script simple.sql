# Exercise 1: Retrieve all columns from the yourls_url table.

select
	*
from
	yourls_url yu;


DESCRIBE yourls_url;


# Exercise 2: Return only the first row. (Use hardcoded data)

select
	*
from
	yourls_url yu
limit 1;


# Exercise 3: Search for records by a specific keyword. (Hardcode a keyword)

select
	*
from
	yourls_url yu
where
	yu.keyword = "ozh";


# Exercise 4: Filter records within a range of timestamps. (Hardcode sample timestamps)

select
	*
from
	yourls_url
where
	timestamp between '2025-10-10 22:54:02' and '2025-10-14 22:54:02';


# Exercise 5: Verify that keyword is the primary key.

show keys
from
yourls_url
where
Key_name = 'PRIMARY';


# Exercise 6: Return all records where clicks > 10. (Hardcode sample clicks)

select
	*
from
	yourls_url
where
	clicks > 10;


# Exercise 7: Count the number of records for each IP address. (Hardcode sample IPs)

select
	ip,
	COUNT(*) as total
from
	yourls_url
group by
	ip;



