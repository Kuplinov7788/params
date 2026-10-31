import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    const [product, setproduct] = useState([])
    console.log(product);

    const getProduct = async () => {
        let req = await fetch('http://localhost:3001/products')
        let res = await req.json()
        setproduct(res)

    }

    useEffect(() => {
        getProduct()
    }, [])




    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Mahsulotlar katalogi</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    product && product.map((element) => (
                        <div key={element.id} className="card bg-base-100 shadow-md flex flex-col justify-between border border-base-200">
                            <figure className="h-48 bg-base-200 p-2">
                                <img
                                    src={element.thumbnail}
                                    alt={element.title}
                                    className="h-full object-contain" />
                            </figure>
                            <div className="card-body p-4 flex flex-col justify-between">
                                <div>
                                    <h2 className="card-title text-lg font-bold">{element.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{element.description}</p>
                                </div>
                                <div className="card-actions justify-between items-center mt-4">
                                    <span className="text-lg font-bold text-primary">${element.price}</span>
                                    <Link to={`/product/${element.id}`}>
                                        <button className="btn btn-primary btn-sm">Batafsil</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Home