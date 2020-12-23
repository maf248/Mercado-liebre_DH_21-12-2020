const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const productsDir = path.join(__dirname, '..', 'data', 'productsDataBase.json');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		
		res.render('products', {products: products, toThousand: toThousand});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		var precioFinal = products[req.params.id -1].price - products[req.params.id -1].price / 100 * products[req.params.id -1].discount;
		precioFinal = toThousand(parseInt(precioFinal));

		res.render('detail', {producto: products[req.params.id -1], precioFinal: precioFinal, toThousand: toThousand});
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		products.push({
			"id": products.length + 1,
			"name": req.body.name,
			"price": req.body.price,
			"discount": req.body.discount,
			"category": req.body.category,
			"description": req.body.description,
			"image": req.file.filename,
		   });
		   const productsJSON = JSON.stringify(products);
		   fs.writeFileSync(productsDir, productsJSON);

		res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		res.render('product-edit-form', {productToEdit: products[req.params.id -1]});
	},
	// Update - Method to update
	update: (req, res) => {
		products[req.params.id -1].name = req.body.name;
		products[req.params.id -1].price = req.body.price;
		products[req.params.id -1].discount = req.body.discount;
		products[req.params.id -1].category = req.body.category;
		products[req.params.id -1].description = req.body.description;
		/*----Borrando Imagen Vieja----*/
		let deletedImageDir = path.join(__dirname, '..', '..', 'public', 'images', 'products', products[req.params.id -1].image);
		fs.unlink(deletedImageDir, function(err) {
			if (err) {
				console.error(err)
				return
			}
		});
		/*----Guardando imagen nueva y cambios en productos data base----*/
		products[req.params.id -1].image = req.file.filename;
		const productsJSON = JSON.stringify(products);
		fs.writeFileSync(productsDir, productsJSON);
		res.redirect('/products');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		/*----Borrando Imagen de producto eliminado----*/
		let deletedImageDir = path.join(__dirname, '..', '..', 'public', 'images', 'products', products[req.params.id -1].image);
		fs.unlink(deletedImageDir, function(err) {
			if (err) {
				console.error(err)
				return
			}
		});
		/*----Borrando indice del producto en variable----*/
		products.splice(req.params.id -1, 1);
		/*----Corrigiendo id en productos array----*/
		for (let i = 0; i < products.length; i++){
			products[i].id = i + 1;
		}
		/*----Guardando cambios en productos data base----*/
		const productsJSON = JSON.stringify(products);
		fs.writeFileSync(productsDir, productsJSON);
		res.redirect('/products');
	}
};

module.exports = controller;