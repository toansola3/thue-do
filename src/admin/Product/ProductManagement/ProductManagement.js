import config from '~/config';
import Menu, { MenuItem } from '../../Menu';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '~/configs/firebase';
import { v4 } from 'uuid';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const cx = classNames.bind(styles);
export default function CreateProducts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState();
    const [deposit, setDeposit] = useState();
    const [category, setCategory] = useState();
    const [status, setStatus] = useState();

    const [images, setImages] = useState([]);
    const [toan, setToan] = useState(false);

    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (event, value) => {
        window.scrollTo(0, 0);
        setCurrentPage(value);

        // console.log(value);
    };
    const handleDelete = (product) => {
        setProductToDelete(product);
        setShowDeleteConfirmation(true);
    };
    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setProductToDelete(null);
    };
    const handleEdit = () => {
        setShowEditConfirmation(true);
    };
    const cancelEdit = () => {
        setShowEditConfirmation(false);
        setProductToEdit(null);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirmation(false);

        if (productToDelete) {
            const response = await fetch(`${process.env.REACT_APP_BASE_URLS}products/remove/${productToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success(`X??a s???n ph???m th??nh c??ng!`);
            } else {
                toast.error(`X??a s???n ph???m kh??ng th??nh c??ng!`);
            }

            setProductToDelete(null);
        }
    };

    const confirmEdit = () => {
        // const updatedProduct = {
        //     id: productToEdit,
        //     name: name,
        //     status: status,
        //     description: draftToHtml(convertToRaw(description.getCurrentContent())),
        //     price: price,
        //     deposit: deposit,
        //     category: { id: category },
        //     images: images,
        // };
        axios
            .put(`${process.env.REACT_APP_BASE_URLS}products/update`, {
                id: productToEdit,
                name: name,
                status: status,
                description: draftToHtml(convertToRaw(description.getCurrentContent())),
                price: price,
                deposit: deposit,
                category: { id: category },
                images: images,
            })
            .then((response) => {
                if (response.status === 200) {
                    toast.success(`Thay ?????i s???n ph???m th??nh c??ng!`);
                } else {
                    toast.error(`Thay ?????i s???n ph???m kh??ng th??nh c??ng!`);
                }
                setShowEditConfirmation(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(`Thay ?????i s???n ph???m kh??ng th??nh c??ng!`);
            });
        setToan(false);
    };

    function onEditorStateChange(editorState) {
        setDescription(editorState);
    }
    useEffect(() => {
        if (toan) {
            confirmEdit();
        }
    }, [toan]);
    useEffect(() => {
        const fetchSearchResults = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URLS}products/page/${searchTerm}?page=${currentPage - 1}&size=10`,
            );
            const data = await response.json();
             setSearchResults(data.contends);
             setTotalPage(data.totalPage);
        };

        if (searchTerm !== '') {
            fetchSearchResults();
        }
    }, [searchTerm, productToDelete, currentPage]);

  useEffect(() => {
      const fetchSearchResults = async () => {
          const response = await fetch(
              `${process.env.REACT_APP_BASE_URLS}products/getAllProduct?page=${currentPage-1}&size=10`,
          );
          const data = await response.json();
          setSearchResults(data.contends);
          setTotalPage(data.totalPage);
      };

      if (searchTerm === '') {
          fetchSearchResults();
      }
  }, [searchTerm, productToDelete, currentPage]);
    const handleInputChange = (event) => {
        const searchValue = event.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchTerm(searchValue);
            setCurrentPage(1);

        }
    };
    const [img, setImg] = useState(null);

    const upImg = () => {
        if (img == null) return;
        const urls = [];
        for (let index = 0; index < img.length; index++) {
            const imagerRef = ref(storage, `images/${img[index].name + v4()}`);
            uploadBytes(imagerRef, img[index]).then(() => {
                getDownloadURL(imagerRef).then((url) => {
                    // setImages([...images, { url: url }]);
                    urls.push({ url: url });
                    //    console.log(images); // ???????c th???c thi khi state ???? ???????c c???p nh???t
                    // console.log(url); // in ra ???????ng d???n c???a ???nh
                    if (img.length === urls.length) {
                        setImages(urls);
                        setToan(true);
                    }
                });
            });
        }
    };
    return (
        <>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" />

            <Menu>
                <div className={cx('function')}>
                    <div className={cx('')}>
                        <MenuItem title="Th??m s???n ph???m" to={config.routes.adminCreateProduct} />
                    </div>
                    <div className={cx('')}>
                        <MenuItem title="Qu???n l?? s???n ph???m " to={config.routes.adminProductManagement} />
                    </div>
                </div>
            </Menu>
            <h1>T??m ki???m s???n ph???m</h1>

            <form className="form-inline my-2 my-lg-0">
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="T??m ki???m m??n ????? n??o ????..."
                    aria-label="Search"
                />
            </form>
            <div className={cx('table')}>
                <ToastContainer />
                <table className="table table-hover table-bordered" id="sampleTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>M?? s???n ph???m</th>
                            <th>T??n s???n ph???m</th>
                            <th>???nh</th>
                            <th>T??nh tr???ng</th>
                            <th>Gi?? ti???n</th>
                            <th>?????t c???c</th>
                            <th>Danh m???c</th>
                            <th>Ch???c n??ng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((result, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{result.id}</td>
                                <td>{result.name}</td>
                                <td>
                                    <img className={cx('img')} src={result.images[0].url} alt="" width="100px;" />
                                </td>

                                <td>
                                    <span className="badge bg-success">{result.status}</span>
                                </td>
                                <td>{result.price.toLocaleString('vi-VN')}??</td>
                                <td>{result.deposit.toLocaleString('vi-VN')}??</td>
                                <td>{result.category.name}</td>
                                <td>
                                    <div className={cx('delete')}>
                                        <button
                                            className=" btn-primary btn-sm "
                                            type="button"
                                            title="X??a"
                                            onClick={() => {
                                                handleDelete();
                                                setProductToDelete(result.id);
                                            }}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                    <div className={cx('edit')}>
                                        <button
                                            className=" btn-primary btn-sm "
                                            type="button"
                                            title="S???a"
                                            id="show-emp"
                                            data-toggle="modal"
                                            data-target="#ModalUP"
                                            onClick={() => {
                                                setProductToEdit(result.id);
                                                handleEdit();
                                            }}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                    <Pagination
                        count={totalPage}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </div>
            </div>
            {/* {showDeleteConfirmation && (
                <div className={cx('contact-container')}>
                    <div className="swal-modal" role="dialog" aria-modal="true">
                        <div className="swal-title">
                            <h1>C???nh b??o</h1>
                        </div>
                        <h2>B???n c?? ch???c ch???n l?? mu???n x??a s???n ph???m n??y?</h2>
                        <div className={cx('swal-footer')}>
                            <button className={cx('button')} onClick={cancelDelete}>
                                H???y b???
                            </button>

                            <button className={cx('button1')} onClick={confirmDelete}>
                                ?????ng ??
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
            <Dialog
                maxWidth={1100}
                // maxHeight={800}
                open={showDeleteConfirmation}
                // TransitionComponent={Transition}
                keepMounted
                onClose={cancelDelete}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogActions>
                    <div>
                        <div role="dialog" aria-modal="true">
                            <div className="">
                                <h1>C???nh b??o</h1>
                            </div>
                            <h2>B???n c?? ch???c ch???n l?? mu???n x??a s???n ph???m n??y?</h2>
                            <div className={cx('swal-footer')}>
                                <Button onClick={cancelDelete} style={{ background: '#0de667', color: 'white' }}>
                                    H???y b???
                                </Button>
                            </div>
                            <Button
                                onClick={() => {
                                    confirmDelete();
                                }}
                                style={{
                                    marginLeft: 100,
                                    marginRight: 100,
                                    background: 'red',
                                    color: 'white',
                                }}
                            >
                                ?????ng ??
                            </Button>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>

            <Dialog
                maxWidth={1100}
                // maxHeight={800}
                open={showEditConfirmation}
                // TransitionComponent={Transition}
                keepMounted
                onClose={cancelEdit}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogActions>
                    <div>
                        <div className={cx('ip')}>
                            <div className="panel panel-primary dialog-panel">
                                <div className="panel-heading">
                                    <h4>Thay ?????i th??ng tin s???n ph???m</h4>
                                </div>
                                <div className="panel-body">
                                    <form className="form-horizontal">
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_accomodation"
                                            >
                                                Lo???i h??ng
                                            </label>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    id="id_accomodation"
                                                    onChange={(event) => setCategory(event.target.value)}
                                                >
                                                    <option value="">--Ch???n lo???i s???n ph???m--</option>
                                                    <option value="1">Qu???n ??o</option>
                                                    <option value="2">Trang s???c</option>
                                                    <option value="3">C??ng ngh???</option>
                                                    <option value="4">Th??? thao</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_accomodation"
                                            >
                                                Tr???ng th??i
                                            </label>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-control"
                                                    id="id_accomodation"
                                                    onChange={(event) => setStatus(event.target.value)}
                                                >
                                                    <option value="">--Ch???n tr???ng th??i s???n ph???m--</option>
                                                    <option value="APPROVED">APPROVED</option>
                                                    <option value="RENTING">RENTING</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_title"
                                            >
                                                T??n s???m ph???m
                                            </label>
                                            <div className="col-md-8">
                                                <div className="col-md-8 indent-small">
                                                    <div className="form-group internal">
                                                        <input
                                                            className="form-control"
                                                            id="id_last_name"
                                                            placeholder="T??n s???n ph???m"
                                                            type="text"
                                                            value={name}
                                                            onChange={(event) => setName(event.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_title"
                                            >
                                                Gi?? ti???n
                                            </label>
                                            <div className="col-md-8">
                                                <div className="col-md-4 indent-small">
                                                    <div className="form-group internal">
                                                        <input
                                                            className="form-control"
                                                            id="id_last_name"
                                                            placeholder="Gi?? ti???n"
                                                            type="text"
                                                            value={price}
                                                            onChange={(event) => setPrice(event.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_title"
                                            >
                                                Gi?? ti???n ?????t c???c s???n ph???m
                                            </label>
                                            <div className="col-md-8">
                                                <div className="col-md-4 indent-small">
                                                    <div className="form-group internal">
                                                        <input
                                                            className="form-control"
                                                            id="id_last_name"
                                                            placeholder="?????t c???c"
                                                            type="text"
                                                            value={deposit}
                                                            onChange={(event) => setDeposit(event.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_title"
                                            >
                                                ???nh s???n ph???m
                                            </label>
                                            <div className="col-md-8">
                                                <div className="col-md-3 indent-small">
                                                    <div className="form-group internal">
                                                        <input
                                                            className="form-control"
                                                            id="id_last_name"
                                                            placeholder="???nh 3"
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => {
                                                                setImg(e.target.files);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                className="control-label col-md-2 col-md-offset-2"
                                                htmlFor="id_comments"
                                            >
                                                Mi??u t??? s???n ph???m
                                            </label>
                                            <div className="col-md-6">
                                                {/* <textarea
                                                    onChange={(event) => setDescription(event.target.value)}
                                                    className="form-control"
                                                    id="id_comments"
                                                    placeholder="Mi??u t???"
                                                    rows="5"
                                                ></textarea> */}
                                                <div style={{ backgroundColor: '#fff' }}>
                                                    <Editor
                                                        editorState={description}
                                                        wrapperClassName="demo-wrapper"
                                                        editorClassName="demo-editor"
                                                        placeholder="Mi??u t???"
                                                        onEditorStateChange={onEditorStateChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-md-offset-1 col-md-12">
                                                {/* <button
                                                className="btn-lg btn-primary"
                                                style={{ marginLeft: 100, marginRight: 100, background: 'red' }}
                                                type="submit"
                                                onClick={confirmEdit}
                                            >
                                                Thay ?????i
                                            </button>
                                            <button className="btn-lg btn-primary" type="" onClick={cancelEdit}>
                                                H???y
                                            </button> */}

                                                <Button
                                                    onClick={() => {
                                                        upImg();
                                                    }}
                                                    style={{
                                                        marginLeft: 100,
                                                        marginRight: 100,
                                                        background: 'red',
                                                        color: 'white',
                                                    }}
                                                >
                                                    Thay ?????i
                                                </Button>
                                                <Button
                                                    onClick={cancelEdit}
                                                    style={{ background: '#0de667', color: 'white' }}
                                                >
                                                    H???y
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    );
}
