import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./link.scss";
import { Pagination } from "antd";
import { NavLink } from "react-router-dom";
import StoreContext from "../../context/context";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import CSS để hiển thị thanh loading

const ProductCreation = () => {
  const [listTutorials, setListTutorials] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [showManyDelete, setShowManyDelete] = useState(false);
  const { setAction, setTargetProductID } = useContext(StoreContext);
  const [toastSuccess, setToastSuccess] = useState(false);
  const [error, setError] = useState("");
  const [toastError, setToastError] = useState(false);
  const [deleteData, setDeleteData] = useState({
    dataDelete: {
      _id: {
        $in: [],
      },
    },
  });
  const handlePageChange = async (page) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BACKEND_URL}/product?limit=5&page=${page}`
      );
      setListTutorials(res.data);
    } catch (error) {
      console.error("Error fetching data: ", error); // Bắt lỗi nếu xảy ra
    }
  };

  const deleteManyProduct = async () => {
    NProgress.start();
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BACKEND_URL}/manyproduct`,
        {
          data: deleteData,
        }
      );
      handlePageChange();
      setShowManyDelete(false);
      setDeleteData({
        dataDelete: {
          _id: {
            $in: [],
          },
        },
      });
      setTimeout(() => {
        setToastSuccess(true);
        setTimeout(() => {
          setToastSuccess(false);
        }, 2000);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
        setError(errorMessage);
      } else {
        setError("Có lỗi không xác định");
      }
      setToastError(true); // Hiển thị thông báo lỗi

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        setToastError(false); // Ẩn thông báo sau 3 giây
      }, 3000);
    }
    NProgress.done();
  };
  const [checkAll, setCheckAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [listCheckItem, setListCheckItem] = useState([]);

  useEffect(() => {
    NProgress.start();
    const updateCheckedItems = () => {
      const checkedItemsArray = Object.keys(checkedItems);

      const trueCheckedItems = checkedItemsArray.filter(
        (key) => checkedItems[key] === true
      );
      setListCheckItem(trueCheckedItems);
    };
    updateCheckedItems();
    NProgress.done();
  }, [checkedItems]);
  useEffect(() => {
    NProgress.start();
    setDeleteData({
      dataDelete: {
        _id: {
          $in: listCheckItem,
        },
      },
    });
    NProgress.done();
  }, [checkedItems, listCheckItem]); // Chạy mỗi khi listCheckItem thay đổi
  useEffect(() => {
    NProgress.start();
    handlePageChange(1);
    NProgress.done();
  }, []);
  const isDisabled = deleteData.dataDelete._id.$in.length === 0;
  const handleCheckAllChange = (e) => {
    const isChecked = e.target.checked;
    setCheckAll(isChecked);
    const newCheckedItems = {};
    listTutorials.data.forEach((item) => {
      newCheckedItems[item._id] = isChecked;
    });
    setCheckedItems(newCheckedItems);
  };
  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const updatedItems = {
        ...prev,
        [id]: !prev[id],
      };
      return updatedItems;
    });
  };
  const [getInfoSearch, setGetInfoSearch] = useState("");
  const [arrInfoSearch, setArrInfoSearch] = useState([]);
  const [displayInfoArr, setDisplayInfoArr] = useState([]);
  const handleGetSearchInfo = async () => {
    let arr = await listTutorials.data;
    const targetIds = arr
      .filter((item) => {
        return item.title
          .toLocaleLowerCase()
          .trim()
          .includes(getInfoSearch.toLocaleLowerCase().trim());
      })
      .map((item) => item._id);
    setArrInfoSearch(targetIds);
    let TargetProduct = arrInfoSearch.map((id) => {
      let result = listTutorials.data.find((item1) => item1._id === id);
      return result;
    });
    if (getInfoSearch.trim() === "") {
      setArrInfoSearch([]);
      setDisplayInfoArr([]);
      return; // Thoát khỏi hàm
    }
    setDisplayInfoArr(TargetProduct);
  };
  if (!listTutorials || !listTutorials.data) {
    return (
      <div className="loader__wrap">
        <div className="loader"></div>
        <div className="loader-text">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {toastSuccess === true ? (
        <div id="toast" className="toast toast--success">
          <div className="toast__icon">
            <img
              src={`${process.env.PUBLIC_URL}/images/icon/like.svg`}
              alt=""
              className="toast__icon-svg"
            />
          </div>
          <div className="toast__body">
            <h3 className="toast__title">Thành Công</h3>
            <p className="toast__msg">Bạn vui lòng đợi kết quả ...</p>
          </div>
          <div className="toast__close">
            <i className="fas fa-times"></i>
          </div>
        </div>
      ) : toastError === true ? (
        <div>
          <div id="toast" className="toast toast--error">
            <div className="toast__icon">
              <img
                src={`${process.env.PUBLIC_URL}/images/icon/error.svg`}
                alt=""
                className="toast__icon-svg"
              />
            </div>
            <div className="toast__body">
              <h3 className="toast__title">Thông báo lỗi</h3>
              <p className="toast__msg">{error}</p>
            </div>
            <div className="toast__close">
              <i className="fas fa-times"></i>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="blog">
        <div className="breadcrumb">
          <div className="breadcrumb__wrap">
            <NavLink to="/home" className="breadcrumb__item">
              <p className="breadcrumb__name">Trang chủ</p>
              <img
                src={`${process.env.PUBLIC_URL}/images/icon/iconbread.svg`}
                alt=""
                className="breadcrumb__icon-arrow"
              />
            </NavLink>
            <NavLink to="/product" className="breadcrumb__item">
              <p className="breadcrumb__name  breadcrumb__active">product</p>
            </NavLink>
          </div>
        </div>
        <h1 className="link__heading">Sản phẩm tham khảo </h1>
        <div className="link__separate"></div>
        <div className="user__search">
          <input
            type="text"
            name=""
            placeholder="Tìm kiếm khóa học..."
            id=""
            value={getInfoSearch}
            onChange={(e) => {
              handleGetSearchInfo();
              setGetInfoSearch(e.target.value);
            }}
            className="link__search--input"
          />
          <button
            onClick={() => {
              handleGetSearchInfo();
            }}
            className="link__search--btn"
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/icon/search.svg`}
              className="link__adding--icon"
              alt=""
            />
          </button>
        </div>

        {showManyDelete && (
          <>
            <div className="link__delete">
              <h1 className="link__delete--notification">
                Bạn muốn xóa tất cả các sản phẩm đã chọn ?
              </h1>
              <div className="link__delete--action">
                <button
                  onClick={() => setShowManyDelete(!showManyDelete)}
                  className=" link__delete--btn link__delete--cancel"
                >
                  Hủy
                </button>
                <button
                  onClick={() => deleteManyProduct()}
                  className="link__delete--btn link__delete--sure"
                >
                  Xóa
                </button>
              </div>
            </div>
            <div
              onClick={() => setShowModel(!showModel)}
              className="link__overlay"
            ></div>
          </>
        )}
        <div className="link__list">
          <div className="link__item">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="checkbox-wrapper-43">
                      <input
                        onChange={handleCheckAllChange}
                        checked={checkAll}
                        type="checkbox"
                        id="checkall"
                      />
                      <label htmlFor="checkall" className="check">
                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                          <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                          <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                      </label>
                    </div>
                  </th>
                  <th>Thông tin sản phẩm</th>
                  <th>Thời gian</th>
                  <th>Tác giả</th>
                  <th>Ngày tạo</th>
                  <th>Sửa</th>
                </tr>
              </thead>
              <tbody>
                {listTutorials.data.length > 0 ? (
                  listTutorials.data.map((item, index) => {
                    return (
                      <tr key={`${index}-tutorials`}>
                        <td>
                          <div className="checkbox-wrapper-43">
                            <input
                              checked={!!checkedItems[item._id]}
                              onChange={() => handleCheckboxChange(item._id)}
                              type="checkbox"
                              id={`input_${item._id}`}
                            />
                            <label
                              htmlFor={`input_${item._id}`}
                              className="check"
                            >
                              <svg
                                width="18px"
                                height="18px"
                                viewBox="0 0 18 18"
                              >
                                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                                <polyline points="1 9 7 14 15 4"></polyline>
                              </svg>
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="link__avatar">
                            <img
                              src={
                                item.urlImage
                                  ? `${item.urlImage}`
                                  : `${process.env.PUBLIC_URL}/images/avatarLesson.jpg`
                              }
                              alt=""
                              className="link__img"
                            />
                            <p className="link__name line-clamp">
                              {item.title}
                            </p>
                          </div>
                        </td>
                        <td>{item.duration} phút</td>
                        <td>
                          <span className="link__name-author">
                            {item.author}
                          </span>
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="link__action">
                          <button
                            onClick={() => {
                              setAction("U");
                              setTargetProductID(item._id);
                            }}
                            className="btn btn-warning mx-3 d-inline-block"
                          >
                            <NavLink to="/product/create_product">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/icon/edit.svg`}
                                alt=""
                                className="link__icon"
                              />
                            </NavLink>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : listTutorials.data.length > 0 ? (
                  listTutorials.data.map((item, index) => {
                    return (
                      <tr key={`${index}-tutorials`}>
                        <td>
                          <div className="checkbox-wrapper-43">
                            <input
                              checked={!!checkedItems[item._id]}
                              onChange={() => handleCheckboxChange(item._id)}
                              type="checkbox"
                              id={`input_${item._id}`}
                            />
                            <label
                              htmlFor={`input_${item._id}`}
                              className="check"
                            >
                              <svg
                                width="18px"
                                height="18px"
                                viewBox="0 0 18 18"
                              >
                                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                                <polyline points="1 9 7 14 15 4"></polyline>
                              </svg>
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="link__avatar">
                            <img
                              src={
                                item.blogImage
                                  ? `${item.blogImage}`
                                  : `${process.env.PUBLIC_URL}/images/avatarLesson.jpg`
                              }
                              alt=""
                              className="link__img"
                            />
                            <p className="link__name line-clamp">
                              {item.title}
                            </p>
                          </div>
                        </td>
                        <td>
                          <span className="link__name-author">
                            {item.author}
                          </span>
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                        <td className="link__action">
                          <button
                            onClick={() => {
                              setAction("U");
                              setTargetProductID(item._id);
                            }}
                            className="btn btn-warning mx-3 d-inline-block"
                          >
                            <NavLink to="/product/create_product">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/icon/edit.svg`}
                                alt=""
                                className="link__icon"
                              />
                            </NavLink>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">Product not found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="link__btn-wrap">
          <button
            style={{
              pointerEvents: isDisabled ? "none" : "auto", // Nếu mảng rỗng thì vô hiệu hóa
              opacity: isDisabled ? 0.5 : 1, // Giảm độ mờ khi bị vô hiệu hóa
            }}
            onClick={() => setShowManyDelete(!showManyDelete)}
            className="link__btn-delete"
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/icon/trash.svg`}
              alt=""
              className="link__icon "
            />
            Xóa
          </button>
          <div className="link__create">
            <NavLink
              to="/product/create_product"
              className={"link__create--link"}
            >
              <button
                onClick={() => setAction("C")}
                className="link__create--btn"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icon/add.svg`}
                  alt=""
                  className="link__icon  icon-svg"
                />
                Thêm Product
              </button>
            </NavLink>
          </div>
        </div>
        <Pagination
          align="center"
          defaultCurrent={1}
          total={50}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ProductCreation;