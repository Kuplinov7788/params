import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';

const ProductParams = () => {
    const { id } = useParams()
    const [product, setproduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState('')
    const [quantity, setQuantity] = useState(1)

    const getProduct = async () => {
        try {
            setLoading(true)
            const req = await fetch(`http://localhost:3001/products/${id}`)
            if (!req.ok) throw new Error("Mahsulot topilmadi")
            const res = await req.json()
            setproduct(res)
            setSelectedImage(res.images?.[0] || res.thumbnail)
        } catch (error) {
            console.error("Xatolik:", error)
            setproduct(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            getProduct()
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-gray-500 font-medium">Mahsulot ma'lumotlari yuklanmoqda...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="text-6xl">🔍</div>
                <h2 className="text-2xl font-bold text-error">Mahsulot topilmadi</h2>
                <p className="text-gray-500">Kechirasiz, siz qidirgan mahsulot mavjud emas yoki o'chirilgan.</p>
                <Link to="/" className="btn btn-primary mt-2">← Bosh sahifaga qaytish</Link>
            </div>
        )
    }

    // Chegirmasiz asl narxni hisoblash
    const originalPrice = product.discountPercentage 
        ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2) 
        : null

    return (
        <div className="min-h-screen bg-base-200/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Navigatsiya / Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <Link to="/" className="btn btn-outline btn-sm gap-2">
                        ← Barcha mahsulotlar
                    </Link>
                    <div className="breadcrumbs text-sm text-gray-500">
                        <ul>
                            <li><Link to="/">Bosh sahifa</Link></li>
                            <li className="capitalize">{product.category}</li>
                            <li className="font-semibold text-base-content line-clamp-1 max-w-[200px]">{product.title}</li>
                        </ul>
                    </div>
                </div>

                {/* Asosiy qism: Rasm va Asosiy ma'lumotlar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-base-100 rounded-2xl shadow-lg p-6 sm:p-8">
                    {/* Chap tomon: Rasmlar galereyasi */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square w-full rounded-2xl bg-base-200 flex items-center justify-center overflow-hidden border border-base-300">
                            <img 
                                src={selectedImage || product.thumbnail} 
                                alt={product.title} 
                                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Kichik rasmlar ro'yxati (thumbnails) */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((imgUrl, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedImage(imgUrl)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-base-200 p-1 transition-all ${
                                            selectedImage === imgUrl ? 'border-primary shadow-md scale-95' : 'border-base-300 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={imgUrl} alt={`${product.title} ${index + 1}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* O'ng tomon: Mahsulot tafsilotlari */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Brend va Kategoriya teglar */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {product.brand && (
                                    <span className="badge badge-primary badge-outline font-semibold">
                                        Brend: {product.brand}
                                    </span>
                                )}
                                <span className="badge badge-ghost capitalize">
                                    {product.category}
                                </span>
                                <span className={`badge ${product.stock > 0 ? 'badge-success text-white' : 'badge-error'}`}>
                                    {product.availabilityStatus || (product.stock > 0 ? 'Mavjud' : 'Tugagan')}
                                </span>
                            </div>

                            {/* Sarlavha */}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content mb-3 leading-tight">
                                {product.title}
                            </h1>

                            {/* Reyting va SKU */}
                            <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-base-200">
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-semibold border border-amber-200">
                                    <span>★</span>
                                    <span>{product.rating}</span>
                                    <span className="text-xs text-amber-600 font-normal">
                                        ({product.reviews?.length || 0} ta sharh)
                                    </span>
                                </div>
                                {product.sku && (
                                    <div className="text-gray-400">
                                        SKU: <span className="font-mono text-base-content">{product.sku}</span>
                                    </div>
                                )}
                            </div>

                            {/* Narx va chegirma */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl sm:text-4xl font-black text-primary">
                                        ${product.price}
                                    </span>
                                    {originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            ${originalPrice}
                                        </span>
                                    )}
                                    {product.discountPercentage && (
                                        <span className="badge badge-secondary badge-sm font-bold">
                                            -{product.discountPercentage}% CHEGIRMA
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Omborda {product.stock} dona qoldi
                                </p>
                            </div>

                            {/* Tavsif */}
                            <div className="mb-6">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">
                                    Tavsif
                                </h3>
                                <p className="text-base-content/80 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Teglar */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {product.tags.map((tag, idx) => (
                                        <span key={idx} className="badge badge-sm badge-soft">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Xarid qilish va miqdor */}
                        <div className="pt-6 border-t border-base-200">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="text-sm font-semibold">Miqdor:</span>
                                <div className="join border border-base-300 rounded-lg">
                                    <button 
                                        type="button"
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="btn btn-sm join-item"
                                    >
                                        -
                                    </button>
                                    <span className="join-item px-4 flex items-center font-semibold bg-base-100">
                                        {quantity}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                                        className="btn btn-sm join-item"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500">
                                    (Min. buyurtma: {product.minimumOrderQuantity || 1} dona)
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="btn btn-primary flex-1 text-base shadow-md">
                                    Savatga qo'shish
                                </button>
                                <button className="btn btn-outline btn-secondary flex-1 text-base">
                                    Hozir xarid qilish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Xususiyatlar va Qo'shimcha Ma'lumotlar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Texnik ko'rsatkichlar */}
                    <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📋</span> Texnik xususiyatlar
                        </h2>
                        <div className="divide-y divide-base-200">
                            <div className="py-2.5 flex justify-between">
                                <span className="text-gray-500">Brend</span>
                                <span className="font-semibold">{product.brand || 'Ko\'rsatilmagan'}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-gray-500">Kategoriya</span>
                                <span className="font-semibold capitalize">{product.category}</span>
                            </div>
                            <div className="py-2.5 flex justify-between">
                                <span className="text-gray-500">Vazni</span>
                                <span className="font-semibold">{product.weight ? `${product.weight} kg` : 'Noma\'lum'}</span>
                            </div>
                            {product.dimensions && (
                                <div className="py-2.5 flex justify-between">
                                    <span className="text-gray-500">O'lchamlari (K × B × Q)</span>
                                    <span className="font-semibold">
                                        {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} sm
                                    </span>
                                </div>
                            )}
                            <div className="py-2.5 flex justify-between">
                                <span className="text-gray-500">Shtrix-kod (Barcode)</span>
                                <span className="font-mono font-semibold">{product.meta?.barcode || 'Mavjud emas'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Kafolat va Yetkazib berish */}
                    <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🚚</span> Yetkazib berish va kafolat
                        </h2>
                        <div className="divide-y divide-base-200">
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-gray-500">Yetkazib berish muddati</span>
                                <span className="badge badge-outline font-semibold">
                                    {product.shippingInformation || '3-5 ish kuni'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-gray-500">Kafolat</span>
                                <span className="badge badge-outline font-semibold">
                                    {product.warrantyInformation || 'Kafolat mavjud'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-gray-500">Qaytarish qoidalari</span>
                                <span className="font-semibold text-right">
                                    {product.returnPolicy || 'Qaytarish mavjud emas'}
                                </span>
                            </div>
                            <div className="py-2.5 flex justify-between items-center">
                                <span className="text-gray-500">Holati</span>
                                <span className="badge badge-success text-white font-semibold">
                                    {product.availabilityStatus || 'Omborda mavjud'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mijozlar sharhlari (Reviews) */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="bg-base-100 rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-200">
                            <div>
                                <h2 className="text-2xl font-bold">Mijozlar fikrlari</h2>
                                <p className="text-sm text-gray-500">
                                    Ushbu mahsulot uchun {product.reviews.length} ta sharh qoldirilgan
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-amber-500 flex items-center justify-end gap-1">
                                    <span>★</span>
                                    <span>{product.rating}</span>
                                </div>
                                <span className="text-xs text-gray-400">Umumiy reyting</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {product.reviews.map((rev, index) => (
                                <div key={index} className="card bg-base-200/60 p-4 rounded-xl border border-base-300 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-base-content text-sm">
                                                {rev.reviewerName}
                                            </span>
                                            <div className="text-amber-500 text-sm font-semibold">
                                                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">
                                            "{rev.comment}"
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-base-300">
                                        {rev.date ? new Date(rev.date).toLocaleDateString() : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductParams
