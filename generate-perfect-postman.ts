import { writeFileSync } from 'fs';

const baseUrl = "http://localhost:5001";

const collection = {
	"info": {
		"_postman_id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
		"name": "Signage ERP Professional",
		"description": "Clean and professional API collection for Signage ERP system.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "1. Authentication",
			"item": [
				{
					"name": "Login",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"vendor_id\": \"7c9e6639-74b0-4054-8025-8848f060d4e9\",\n    \"identifier\": \"admin@unitedgraphics.com\",\n    \"password\": \"password123\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseUrl}}/users/login",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"users",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get My Profile",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/users/me",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"users",
								"me"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "2. Vendors",
			"item": [
				{
					"name": "Create Vendor",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"United Graphics\",\n    \"contact_person\": \"Arfaj Sheru\",\n    \"phone\": \"9876543210\",\n    \"email\": \"info@unitedgraphics.com\",\n    \"address\": \"Mumbai, Maharashtra\",\n    \"gst_number\": \"27AAACU1234A1Z5\",\n    \"pan_number\": \"AAACU1234A\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseUrl}}/vendors",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"vendors"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get All Vendors",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/vendors?page=1&limit=10",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"vendors"
							],
							"query": [
								{
									"key": "page",
									"value": "1"
								},
								{
									"key": "limit",
									"value": "10"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "3. Master Data",
			"item": [
				{
					"name": "Get Business Types",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/project-types",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"project-types"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get Stage Types",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/stage-types",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"stage-types"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "4. Projects",
			"item": [
				{
					"name": "Create Project",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Lollipop Signage\",\n    \"description\": \"Outdoor LED signage\",\n    \"business_type_id\": \"uuid-here\",\n    \"total_amount\": 15000,\n    \"advance_paid\": 5000,\n    \"deadline\": \"2024-12-30T00:00:00Z\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{baseUrl}}/projects",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"projects"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get Project Stats",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{token}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{baseUrl}}/projects/stats",
							"host": [
								"{{baseUrl}}"
							],
							"path": [
								"projects",
								"stats"
							]
						}
					},
					"response": []
				}
			]
		}
	],
	"variable": [
		{
			"key": "baseUrl",
			"value": "http://localhost:5001",
			"type": "string"
		},
		{
			"key": "token",
			"value": "PASTE_TOKEN_HERE",
			"type": "string"
		}
	]
};

writeFileSync('Signage-API-Collection.json', JSON.stringify(collection, null, 2));
console.log('✅ Postman Collection Updated in Standard Format!');
