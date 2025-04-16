import boto3

# Create a DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Choose the DynamoDB table
table = dynamodb.Table('Players')

# Data to be added
item_data = {
    'id': '1',
    'name-first': 'Jim',
    'name-last': 'Doe',
    'email': 'john.doe@example.com'
}

# Add data to DynamoDB
table.put_item(Item=item_data)