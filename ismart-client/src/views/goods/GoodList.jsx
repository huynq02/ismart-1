import React, { useEffect, useState, useRef } from 'react';
import { Table, DropdownButton, Col, Row } from 'react-bootstrap';
import { fetchGoodsWithFilter, fetchAllGoodsInWarehouse } from '~/services/GoodServices';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchAllCategories } from '~/services/CategoryServices';
import { fetchAllSuppliers } from '~/services/SupplierServices';
import { fetchAllStorages } from '~/services/StorageServices';
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import ReactPaginate from 'react-paginate';
import { formatDate, formattedAmount } from '~/validate';
import ModalGoodHistory from './GoodHistory';
import ModalEditGood from './EditProduct';
import ModalAddGood from './AddProduct';
import { fetchUserByUserId } from '~/services/UserServices';
import { useNavigate } from 'react-router-dom';
import ModalZoomImage from "../components/others/Image/ModalZoomImage";
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';
import InportGoodsListModal from './inputExport/InPort';
import ExportGoodsListModal from './inputExport/Export';
import { TorusGeometry } from 'three';
import { ReactBarcode } from 'react-jsbarcode';
import ReactToPrint from 'react-to-print';




function MyTable() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);


    const [pageSize, setPageSize] = useState(15);


    const [listGoods, setListGoods] = useState({});
    const [totalCategories, setTotalCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);


    const [totalSuppliers, setTotalSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);


    // const [totalStorages, setTotalStorages] = useState([]);
    // const [selectedStorage, setSelectedStorage] = useState(null);
    // const [selectedStorageId, setSelectedStorageId] = useState(null);




    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);




    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);


    const [keywordSearch, setKeywordSearch] = useState("");


    const [sortedByPriceId, setSortedByPriceId] = useState();
    const [sortedByPriceName, setSortedByPriceName] = useState("");
    const [sortOptions, setSortOptions] = useState([]);


    const [isShowGoodHistory, setIsShowGoodHistory] = useState(false);
    const [dataGood, setDataGood] = useState({});


    const [isShowModalZoomImage, setIsShowModalZoomImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");


    const [isShowModelEditGood, setIsShowModelEditGood] = useState(false);
    const [dataGoodEdit, setDataGoodEdit] = useState([]);


    const [isShowModelAddGood, setIsShowModelAddGood] = useState(false);


    const [showInStock, setShowInStock] = useState(true);


    const [isShowModalInputExcel, setIsShowModalInputExcel] = useState(false);
    const [isShowModalExportExcel, setIsShowModalExportExcel] = useState(false);


    const [startIndexOfPage, setStartIndexOfPage] = useState(1);


    const [showNoDataMessage, setShowNoDataMessage] = useState(false);


    const barcodeOptions = {
        format: "CODE128", // Loại mã vạch
        width: 0.9, // Độ rộng của các dòng trong mã vạch
        height: 50, // Chiều cao của mã vạch
        displayValue: true // Hiển thị giá trị trên mã vạch
    };
    const barcodeRefs = useRef(Array(listGoods.length).fill(null));

    useEffect(() => {
        let res = getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, selectedSupplierId);
        getAllCategories();
        getAllSuppliers();
        getAllStorages();
        setSortOptions([{ idSort: null, nameSort: "Giá" },
        { idSort: 1, nameSort: "Giá Từ bé đến lớn" },
        { idSort: 2, nameSort: "Giá Từ lớn đến bé" }]);


        if (roleId === 1) {
            getStorageIdByUser();
        }
        else if (roleId === 2) {
            setSelectedWarehouseId(localStorage.getItem('warehouseId'));
            setSelectedWarehouse(localStorage.getItem('warehouseName'));
            setShowInStock(true);// Show inStock for role 2
        }
    }, [])




    useEffect(() => {
        if (selectedWarehouseId) {
            getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, selectedSupplierId);
        }
    }, [selectedWarehouseId, selectedCategoryId, selectedSupplierId, sortedByPriceId, keywordSearch])
    useEffect(() => {
        getGoods(1, pageSize);
    }, [pageSize])




    const getStorageIdByUser = async () => {
        let res = await fetchUserByUserId(userId);
        setSelectedWarehouseId(res.warehouseId);
        setSelectedWarehouse(res.warehouseName);
        setShowInStock(false);// Hide inStock initially for role 1
        // console.log("getStorageIdByUser:", res);
    }


    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }


    const getGoods = async (
        page = 1, pageSize = 15,
        warehouseId = selectedWarehouseId, // Thêm giá trị mặc định cho warehouseId
        categoryId = selectedCategoryId, // Thêm giá trị mặc định cho categoryId
        supplierId = selectedSupplierId, // Thêm giá trị mặc định cho supplierId
        sortPrice = sortedByPriceId, // Thêm giá trị mặc định cho sortPrice
        wordSearch = keywordSearch // Thêm giá trị mặc định cho wordSearch
    ) => {
        setStartIndexOfPage((page - 1) * pageSize + 1);
        if (roleId === 1) {


            let res = await fetchGoodsWithFilter(pageSize,
                page, warehouseId,
                categoryId, supplierId,
                sortPrice, wordSearch);
            // console.log("pageSize:", pageSize);
            setListGoods(res.data);
            setTotalPages(res.totalPages);
            setcurrentPage(page - 1);
        } else if (roleId === 2 || roleId === 3 || roleId === 4) {
            let warehouse = await getWarehouseById(userId);
            let goods = await fetchGoodsWithFilter(pageSize, page, warehouse.warehouseId, categoryId, supplierId,
                sortPrice, wordSearch);
            // console.log("goods:", goods.data);
            setListGoods(goods.data);
            setTotalPages(goods.totalPages);
            setcurrentPage(page - 1);


            // console.log("goodList2:  ", goods);
        }
    }


    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        // Kiểm tra nếu newSize là số âm, đặt pageSize là 1
        if (newSize > 0) {
            setPageSize(newSize);
        } else {
            // Có thể hiển thị thông báo lỗi hoặc đặt một giá trị mặc định
            setPageSize(1);
        }
    }


    const getAllCategories = async () => {
        let res = await fetchAllCategories();
        setTotalCategories(res);
    }


    const getAllSuppliers = async () => {
        let res = await fetchAllSuppliers();
        setTotalSuppliers(res);
    }


    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
        // console.log("totalWarehouse", res);
    }


    const handleCategoryClick = (category) => {
        setSelectedCategory(category.categoryName);
        setSelectedCategoryId(category.categoryId);
        const res = getGoods(1, pageSize, selectedWarehouseId, category.categoryId, selectedSupplierId, sortedByPriceId, keywordSearch);
        setListGoods(res);
    }


    const handleSupplierClick = (supplier) => {
        setSelectedSupplier(supplier.supplierName);
        setSelectedSupplierId(supplier.supplierId);
        const res = getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, supplier.supplierId, sortedByPriceId, keywordSearch);
        setListGoods(res);
        // getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, supplier.supplierId, sortedByPriceId, keywordSearch).then(res => {
        //     setListGoods(res); // Cập nhật danh sách hàng hóa với dữ liệu mới
        // });
    }




    const handleSupplierClickTotal = () => {
        setSelectedSupplier("Nhà cung cấp");
        setSelectedSupplierId(null);
        getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, null, sortedByPriceId, keywordSearch);
        // Gọi getGoods mà không có nhà cung cấp cụ thể
        // getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, null, sortedByPriceId, keywordSearch).then(res => {
        //     setListGoods(res); // Cập nhật danh sách hàng hóa
        // });
    };


    const handleCategoryClickTotal = async () => {
        setSelectedCategory("Các danh mục");
        setSelectedCategoryId(null);
        getGoods(1, pageSize, selectedWarehouseId, null, selectedSupplierId, sortedByPriceId, keywordSearch);
    }


    const handleStorageClickTotal = async () => {
        setSelectedWarehouse("Tất cả kho");
        setSelectedWarehouseId(null);
        setShowInStock(false);
        await getGoods(1, pageSize, null, selectedCategoryId, selectedSupplierId, sortedByPriceId, keywordSearch);


    }


    const handleStorageClick = (warehouse) => {


        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
        setShowInStock(true);
        const res = getGoods(1, warehouse.warehouseId, selectedCategoryId, selectedSupplierId, sortedByPriceId, keywordSearch);
        // const res = await getGoods(warehouse.warehouseId);
        setListGoods(res);
        // console.log("selectedWarehouseId:", res);
    }




    const handlePageClick = (event) => {
        const newPage = +event.selected;
        setcurrentPage(newPage);
        getGoods(newPage + 1, pageSize); // Gọi getGoods với trang mới và pageSize
    }






    const handleSearch = () => {
        getGoods(1, pageSize, selectedWarehouseId, selectedCategoryId, selectedSupplierId, sortedByPriceId, keywordSearch);
    }


    const handleShowGoodHistory = (good) => {
        setIsShowGoodHistory(true);
        setDataGood(good);


    }


    const handleZoomImage = (image) => {
        setIsShowModalZoomImage(true);
        setImageUrl(image);
    }


    const showModelEditGood = (good) => {
        setIsShowModelEditGood(true);
        setDataGoodEdit(good);
    }


    const updateTable = () => {
        getGoods(currentPage + 1, pageSize);
    }


    const handleImportClick = () => {
        setIsShowModalInputExcel(true);
    }




    return (
        <div className="container" style={{ maxWidth: "1600px" }}>
            <div className="row justify-content-center">
                <div className="col-sm-12">
                    <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý hàng hoá</h2>
                    <Row>
                        <div className="row no-gutters my-3 ">
                            <Col md={2}>
                                {(roleId == 1) ?
                                    <div className="col-2">
                                        <DropdownButton
                                            className="DropdownButtonCSS ButtonCSSDropdown"
                                            title={selectedWarehouse ? selectedWarehouse : "Tất cả Kho"}
                                            variant="success"
                                            style={{ zIndex: 999 }}
                                        >


                                            <Dropdown.Item eventKey=""
                                                onClick={() => handleStorageClickTotal()}>Tất cả kho</Dropdown.Item>


                                            {totalWarehouse && totalWarehouse.length > 0 && totalWarehouse.map((c, index) => (
                                                <Dropdown.Item
                                                    key={`warehouse ${index}`}
                                                    eventKey={c.warehouseName}
                                                    onClick={(e) => handleStorageClick(c, e)}
                                                >
                                                    {c.warehouseName}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>






                                    </div>
                                    :
                                    <Col md={2}>
                                        <input type="text" className="form-control inputCSS"
                                            aria-describedby="emailHelp"
                                            value={selectedWarehouse} disabled />
                                    </Col>


                                }
                            </Col>
                            <Col md={1}>
                                <div className="input-group mb-3">


                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Nhập pageSize"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}


                                    />
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className="mt-1 mb-1" style={{ fontSize: '1.3rem', marginLeft: '-5px' }}>
                                    ( Số hàng / trang )
                                </div>
                            </Col>


                            <div className="col">
                            </div>


                            <div className="col">
                                <div className="input-group">
                                    <input
                                        className="form-control border-secondary inputCSS"
                                        type="search"
                                        placeholder='Tìm kiếm...'
                                        id="example-search-input4"
                                        onChange={(event) => setKeywordSearch(event.target.value)}


                                        readOnly={false}
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-secondary rounded-0 form-control"
                                            type="button"
                                            onClick={handleSearch}
                                        >
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {
                                (roleId == 1 || roleId == 2) ?
                                    <div className="col-auto">


                                        <button
                                            className="btn btn-success border-left-0 rounded ButtonCSS"
                                            type="button"
                                            onClick={() => setIsShowModelAddGood(true)}
                                        ><i className="fa-solid fa-plus"></i>
                                            &nbsp;Thêm hàng hóa
                                        </button>


                                    </div>
                                    : ''
                            }


                            {
                                (roleId == 1 || roleId == 2) ?
                                    <div className="col">
                                        <button className="btn btn-success border-left-0 rounded ButtonCSS"
                                            variant="primary" style={{ zIndex: 999 }} onClick={() => handleImportClick()} >
                                            <i className="fa-solid fa-file-import"></i>
                                            &nbsp;&nbsp;&nbsp;Nhập bằng Excel
                                        </button>
                                    </div>
                                    : ''
                            }
                        </div>
                    </Row>


                    <div className=" table-responsive" style={{ overflowY: 'auto', overflowX: 'auto', zIndex: 3 }}>
                        <Table className="table text-center table-border table-hover  border-primary table-sm " >


                            <thead className='sticky-top' style={{ zIndex: 5 }}>
                                <tr>
                                    <th className="align-middle text-nowrap">STT</th>
                                    <th className="align-middle text-nowrap">Mã SP</th>
                                    <th className="align-middle textColor text-nowrap">TÊN SẢN PHẨM</th>
                                    <th className="align-middle text-nowrap">HÌNH ẢNH</th>


                                    <th className="align-middle text-nowrap " style={{ overflow: 'visible' }}>
                                        <Dropdown style={{ position: 'relative' }}>
                                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                                <span style={{ color: 'white' }}>{selectedSupplier !== null ? selectedSupplier : "Nhà cung cấp"}</span>
                                            </Dropdown.Toggle>


                                            <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                                <Dropdown.Item onClick={handleSupplierClickTotal}>
                                                    Nhà cung cấp
                                                </Dropdown.Item>
                                                {totalSuppliers && totalSuppliers.length > 0 && totalSuppliers.map((s, index) => (
                                                    <Dropdown.Item key={`supplier ${index}`}
                                                        eventKey={s.supplierName} onClick={(e) => handleSupplierClick(s, e)}>
                                                        {s.supplierName}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </th>


                                    <th className="align-middle text-nowrap" style={{ overflow: 'visible' }}>
                                        <Dropdown style={{ position: 'relative' }}>
                                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                                <span style={{ color: 'white' }}>{selectedCategory !== null ? selectedCategory : "Danh mục"}</span>
                                            </Dropdown.Toggle>


                                            <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                                <Dropdown.Item onClick={handleCategoryClickTotal}>
                                                    Các danh mục
                                                </Dropdown.Item>
                                                {totalCategories && totalCategories.length > 0 && totalCategories.map((c, index) => (
                                                    <Dropdown.Item key={`category ${index}`} eventKey={c.categoryName} onClick={(e) => handleCategoryClick(c, e)}>
                                                        {c.categoryName}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </th>




                                    {showInStock && <th className="align-middle text-nowrap">TỒN KHO</th>}
                                    <th className="align-middle text-nowrap">ĐƠN VỊ</th>
                                    <th className="align-middle text-nowrap">TỒN KHO<br />TỐI THIỂU</th>
                                    <th className="align-middle text-nowrap">TỒN KHO<br />TỐI ĐA</th>
                                    <th className="align-middle text-nowrap">NGÀY KHỞI TẠO</th>
                                    {/* <th className='align-middle text-nowrap'>GIÁ NHẬP</th> */}
                                    <th className="align-middle text-nowrap">HẠN<br />BẢO HÀNH</th>


                                    <th className="align-middle text-nowrap">BARCODE</th>
                                    <th className="align-middle text-nowrap">LỊCH SỬ<br />HÀNG HÓA</th>
                                    {(roleId === 1 || roleId === 2) ? <th className="align-middle text-nowrap">TUỲ CHỌN</th> : ''}


                                </tr>
                            </thead>


                            <tbody >
                                {listGoods && listGoods.length > 0 &&
                                    listGoods.map((g, index) => (

                                        <tr key={`goods${index}`}>


                                            <td className="align-middle text-color-primary">{startIndexOfPage + index}</td>
                                            <td className="align-middle text-color-primary">{g.goodsCode}</td>
                                            <td className="align-middle">{g.goodsName}</td>
                                            <td className="align-middle" onClick={() => handleZoomImage(g.image)}>
                                                <img src={g.image} alt="Image" style={{ width: '50px', height: '50px' }} />
                                            </td>
                                            <td className="align-middle">{g.supplierName}</td>
                                            <td className="align-middle">{g.categoryName}</td>
                                            {showInStock && <td className="align-middle">{g.inStock}</td>}
                                            <td className="align-middle">{g.measuredUnit}</td>
                                            <td className="align-middle">{g.minStock}</td>
                                            <td className="align-middle">{g.maxStock}</td>
                                            <td className="align-middle">{formatDate(g.createdDate ? g.createdDate : "2024-03-18T04:10:59.041Z")}</td>
                                            {/* <td className='align-middle'>{formattedAmount(g.stockPrice)}</td> */}
                                            <td className="align-middle">{g.warrantyTime + " Tháng "}</td>
                                            <td className="align-middle">
                                                {(() => {
                                                    const barcodeValue = g.barcode && g.barcode.trim() !== "" ? g.barcode : "null"; // Đảm bảo giá trị không trống
                                                    if (barcodeValue !== "null") {
                                                        return <div ref={(ref) => barcodeRefs.current[index] = ref}>
                                                            <ReactBarcode value={barcodeValue} options={barcodeOptions} />
                                                        </div>;
                                                    }
                                                    return null;
                                                })()}
                                            </td>
                                            <td className="align-middle"><i className="fa-solid fa-clock-rotate-left actionButtonCSS" onClick={() => handleShowGoodHistory(g)}></i></td>
                                            {
                                                (roleId == 1 || roleId == 2) ?
                                                    <td className="align-middle " style={{ padding: '10px' }}>
                                                        <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => showModelEditGood(g)}></i>
                                                        <ReactToPrint
                                                            trigger={() => <button variant="primary" className='fa-solid fa-barcode actionButtonCSS'></button>}
                                                            content={() => barcodeRefs.current[index]}
                                                        />

                                                    </td>
                                                    : ''
                                            }
                                        </tr>
                                    ))


                                }
                            </tbody>


                            {/* {showNoDataMessage &&
                            <div style={{ fontSize: '24px', textAlign: 'center' }}
                            >Không có dữ liệu</div>} */}


                        </Table>




                    </div>
                    <div className="d-flex justify-content-center  mt-3">
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="Sau >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={totalPages}
                            forcePage={currentPage}
                            previousLabel="< Trước"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                        />
                    </div>
                </div>
            </div>
            <ModalZoomImage isShow={isShowModalZoomImage} handleClose={() => setIsShowModalZoomImage(false)} imageUrl={imageUrl} />
            <ModalGoodHistory isShow={isShowGoodHistory}
                handleClose={() => setIsShowGoodHistory(false)}
                dataGood={dataGood}
                warehouseId={selectedWarehouseId} />
            <ModalEditGood isShow={isShowModelEditGood}
                handleClose={() => setIsShowModelEditGood(false)}
                dataGoodEdit={dataGoodEdit} updateTable={updateTable} />
            <ModalAddGood isShow={isShowModelAddGood} handleClose={() => setIsShowModelAddGood(false)} updateTable={updateTable} />
            <InportGoodsListModal isShow={isShowModalInputExcel} handleClose={() => setIsShowModalInputExcel(false)} updateTable={updateTable} />
            <ExportGoodsListModal isShow={isShowModalExportExcel} handleClose={() => setIsShowModalExportExcel(false)} />
        </div >
    );
}


export default MyTable;





