/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - admin
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of user
 *         password:
 *           type: string
 *           description: password of user
 *         admin:
 *           type: boolean
 *           description: admin or not  
 *       example:
 *         id: d5fE_asz
 *         username: sanket
 *         password: sanket
 *         admin: true
 *     Products:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - category
 *         - rating 
 *         - brand 
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The product name
 *         price:
 *           type: number
 *           description: price of product
 *         category:
 *           type: string
 *           description: category of product
 *         rating:
 *           type: number
 *           description: rating of the product
 *         brand:
 *           type: string
 *           description: brand name of the product
 *       example:
 *         id: d5fE_asz
 *         title: iphone 15
 *         price: 150000
 *         rating: 9
 *         category: smartphone
 *         brand: Apple 
 */

 /**
  * @swagger
  * tags:
  *   name: User
  *   description: The books managing API
  */

 /**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Products'
 */

 /**
 * @swagger
 * /signin:
 *   post:
 *     summary: Signin
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */