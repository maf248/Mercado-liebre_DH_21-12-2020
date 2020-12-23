const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'data', 'productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: function(req, res, next) {

		let data = products.reduce(function (result, product) {
		  if (product.category == 'visited') {
			result.visited.push(product);
		  } else {
			result.inSale.push(product);
		  }
		  return result;
		}, { inSale: [], visited: [], toThousand: toThousand });
  
		  res.render('index', data);
		},
	search: (req, res) => {
		let resultados = [];
		
		products.forEach(producto => {
			if(req.query.keywords.length != 0 && producto.name.toLowerCase().includes(req.query.keywords.toLowerCase())) {
				resultados.push(producto);
			}
		});
		
		let cantidad = 0;
		if (resultados == []) {
			cantidad = 0;
		} else cantidad = resultados.length;

		res.render('results', {productosSearch: resultados, toThousand: toThousand, cantidad: cantidad});
		}
	
};

module.exports = controller;
