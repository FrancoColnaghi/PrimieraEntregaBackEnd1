const socket = io()

const contenedorProductos = document.querySelector('.products-container')

socket.on('home', (data)=>{
    contenedorProductos.innerHTML = ''
    data.forEach(product => {
        const div = document.createElement('div')
        div.classList.add('cart')

        const id = document.createElement('p')
        id.innerText = product._id
        const title = document.createElement('p')
        title.innerText = product.title
        const description = document.createElement('p')
        description.innerText = product.description
        const price = document.createElement('p')
        price.innerText = '$ ' + product.price
        const code = document.createElement('p')
        code.innerText = product.code
        const stock = document.createElement('p')
        stock.innerText = product.stock
        const category = document.createElement('p')
        category.innerText = product.category
        const btnAddCart = document.createElement('button')
        btnAddCart.innerText = "Agregar al carrito"
        btnAddCart.onclick = ()=>{socket.emit("agregar-a-carrito", product._id)}

        div.appendChild(id)
        div.appendChild(title)
        div.appendChild(description)
        div.appendChild(price)
        div.appendChild(code)
        div.appendChild(stock)
        div.appendChild(category)
        div.appendChild(btnAddCart)

        contenedorProductos.appendChild(div)
    });
} )

