import images from '~/assets/images';

import classNames from 'classnames/bind';
import styles from '../Product.module.scss';
import Menu, { MenuItem } from '../Menu';
import config from '~/config';

const cx = classNames.bind(styles);
function EditOrders() {
    // const id = localStorage.getItem('username');
    const imgUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            <div className="back-to-top" style={{ display: 'block', opacity: 1 }}></div>
            <div>
                <div className="user-header-wrapper">
                    <div className="user-header-inner flexbox">
                        <div className="user-header-overlay"></div>
                        <img
                            className="user-header"
                            src={imgUser.imageUrl ? imgUser.imageUrl : images.noImage1}
                            alt=""
                        />
                    </div>
                </div>
                <div className="user-info-bar">
                    <div className="ufo-bar-col1"></div>
                    <div className="ufo-bar-col2">
                        <div className="ufo-bar-col2-inner">
                            <div className="user-icon-wrapper">
                                <img
                                    className="user-icon"
                                    src={imgUser.avatar ? imgUser.avatar : images.noImage}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="ufo-bar-col3">
                        <div className="ufo-bar-col3-inner">
                            <div className="username-wrapper-outer">
                                <div className="username-wrapper">
                                    <h3 className="username-dev">
                                        {!imgUser.firstName
                                            ? imgUser.username
                                            : `${imgUser.firstName} ${imgUser.lastName}`}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ufo-bar-col5"></div>
                </div>

                <Menu>
                    <div className={cx('function')}>
                        <div className={cx('')}>
                            <MenuItem title="????n ?????t h??ng" to={config.routes.EditOrders} />
                        </div>
                        <div className={cx('')}>
                            <MenuItem title="L???ch s???" to={config.routes.History} />
                        </div>
                    </div>
                </Menu>
            </div>
        </div>
    );
}

export default EditOrders;
