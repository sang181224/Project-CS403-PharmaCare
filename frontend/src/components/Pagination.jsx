import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null; // Không hiển thị nếu chỉ có 1 trang
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="inline-flex -space-x-px">
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-2 leading-tight border border-gray-300 ${currentPage === number
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Pagination;