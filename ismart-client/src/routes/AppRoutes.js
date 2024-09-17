import { Routes, Route } from 'react-router-dom';
// import NotFoundPage from './NotFoundPage';
import Login from '../views/pages/authentication/Login';
import ForgotPassword from '../views/pages/authentication/ForgotPassword';
import ChangePassword from '../views/pages/authentication/ChangePassword';
import NavbarCom from '../views/components/NavbarCom';
import GoodList from '../views/goods/GoodList';
import WarehouseThree from '../views/warehousethreejs/warehousethree';
import SupplierList from '../views/suppliers/SuppliersList';
import StorageList from '../views/storages/StorageList';
import CategoryList from '../views/categories/CategoryList';
import ImportOrderList from '../views/importOrders/ImportOrdersList';
import ImportOrderListN from '../views/importOrdersN/ImportOrderListN';
import ExportOrderList from '../views/exportOrders/ExportOrderList';
import ExportOrderListInternal from '../views/exportOrdersInternal/ExportOrderListInternal';
import StockTakeList from '~/views/stocktake/StockTakeList';
import DeliveryList from '~/views/deliveries/ListDelivery';
import Sidebar from '../views/components/Sidebar';
import ListAccount from '~/views/accounts/AccountList';
import ProjectList from '~/views/project/ProjectList';
import { Container, Row, Col } from 'react-bootstrap';
import Doashboard from '~/views/doashboard/Doashboard';
import Error from '~/views/error/error';
import PrivateRoute from './PrivateRoute';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import CustomerList from '~/views/customer/CustomerList';
import ConfirmImportOrder from '~/views/importOrders/ConfirmImportOrder';
import InventoryInport from '~/views/inventoryReport/import/InventoryImport';
import InventoryExport from '~/views/inventoryReport/export/InventoryExport';
import InventoryAll from '~/views/inventoryReport/inventory/Inventory';
import ReturnOrderList from '~/views/returnOrder/ReturnOrderList';


const AppRoutes = () => {

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Login />
                    }
                />
                <Route path="/dang-nhap" element={<Login />} />
                <Route
                    path="/quen-mat-khau"
                    element={
                        <Container fluid>
                            <ForgotPassword />
                        </Container>
                    }
                />

                <Route path='/doi-mat-khau'
                    element={

                        <Container fluid>
                            <NavbarCom />
                            <ChangePassword />
                        </Container>

                    }

                />


                <Route
                    path="/nha-cung-cap"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col >
                                        <NavbarCom />
                                        <SupplierList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route
                    path="/quan-ly-khach-hang"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col >
                                        <NavbarCom />
                                        <CustomerList />
                                    </Col>
                                </Row>
                            </Container>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cac-kho-hang"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col >
                                        <NavbarCom />
                                        <StorageList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route
                    path="/cac-danh-muc"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col >
                                        <NavbarCom />
                                        <CategoryList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />
                <Route
                    path="/cac-lo-hang-nhap-ngoai"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ImportOrderList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />
                <Route
                    path="/cac-lo-hang-nhap-noi"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ImportOrderListN />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route
                    path="/quan-ly-ton-kho-nhap"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <InventoryInport />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route
                    path="/quan-ly-ton-kho-xuat"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <InventoryExport />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />
                <Route
                    path="/quan-ly-ton-all"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <InventoryAll />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />
                <Route
                    path="/cac-lo-hang-xuat-khach-hang"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ExportOrderList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route
                    path="/cac-lo-hang-xuat-noi"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ExportOrderListInternal />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route
                    path="/tra-lai-don-hang"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ReturnOrderList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                />

                <Route path='/thong-ke'
                    element={
                        // roleId === 1 || roleId === 2 || roleId === 4 ? (
                        <PrivateRoute>
                            <Container fluid>
                                <Row>
                                    <Sidebar />
                                    <Col>
                                        <NavbarCom />
                                        <Doashboard className="overflow-auto" />
                                    </Col>
                                </Row>
                            </Container>
                        </PrivateRoute>
                        // ) : (
                        //     <Navigate to="/NotFoundPage" replace />
                        // )
                    }

                >

                </Route >
                <Route path='/ben-van-chuyen'
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col >
                                        <NavbarCom />
                                        <DeliveryList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }

                ></Route>
                <Route path='/du-an'
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col >
                                        <NavbarCom />
                                        <ProjectList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }

                ></Route>
                <Route path='/kiem-ke'
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />

                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <StockTakeList />
                                    </Col>
                                </Row>
                            </Container></PrivateRoute>
                    }
                >
                </Route >

                <Route path='/danh-sach-mat-hang'
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />
                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <GoodList />
                                    </Col>
                                </Row>
                            </Container>
                        </PrivateRoute>
                    }
                />
                <Route path='/kho-3d'
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />
                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <WarehouseThree />
                                    </Col>
                                </Row>
                            </Container>
                        </PrivateRoute>
                    }
                />

                <Route path='/quan-ly-tai-khoan'
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />
                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ListAccount />
                                    </Col>
                                </Row>
                            </Container>
                        </PrivateRoute>
                    }
                />

                <Route path='/ban-khong-co-quyen-truy-cap'
                    element={
                        <PrivateRoute>
                            <Error />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/confirm-import-order/:importId"
                    element={
                        <PrivateRoute>
                            <Container fluid>
                                <Row className="flex-nowrap">
                                    <Sidebar />
                                    <Col className="py-3 background-primary overflow-auto">
                                        <NavbarCom />
                                        <ConfirmImportOrder />
                                    </Col>
                                </Row>
                            </Container>
                        </PrivateRoute>
                    }
                />
            </Routes >

        </>
    )
}

export default AppRoutes;