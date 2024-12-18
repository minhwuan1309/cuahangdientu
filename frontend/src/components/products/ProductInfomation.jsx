import React, { memo, useState, useCallback } from 'react'
import { productInfoTabs } from '../../utils/contants'
import { Votebar, Button, VoteOption, Comment } from '..'
import { renderStarFromNumber } from '../../utils/helpers'
import { apiRatings } from '../../apis'
import { useDispatch, useSelector } from 'react-redux'
import { showModal } from '../../store/app/appSlice'
import Swal from 'sweetalert2'
import path from '../../utils/path'
import { useNavigate } from 'react-router-dom'


const ProductInfomation = ({ totalRatings, ratings, nameProduct, pid, rerender }) => {
    const [activedTab, setActivedTab] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn } = useSelector(state => state.user)

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !pid || !score) {
            alert('Please vote when click submit')
            return
        }
        await apiRatings({ star: score, comment, pid, updatedAt: Date.now() })
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        rerender()
    }
    const handleVoteNow = () => {
      if (!isLoggedIn) {
        Swal.fire({
          text: "Vui lòng đăng nhập để bình chọn",
          cancelButtonText: "Hủy",
          confirmButtonText: "Đi đến trang đăng nhập",
          title: "Oops!",
          showCancelButton: true,
        }).then((rs) => {
          if (rs.isConfirmed) navigate(`/${path.LOGIN}`);
        });
      } else {
        dispatch(
          showModal({
            isShowModal: true,
            modalChildren: (
              <VoteOption
                nameProduct={nameProduct}
                handleSubmitVoteOption={handleSubmitVoteOption}
              />
            ),
          })
        );
      }
    };
    return (
        <div>
            <div className='flex flex-col py-8 w-main'>
                <div className='flex border'>
                    <div className='flex-4 flex-col flex items-center justify-center '>
                        <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index}>{el}</span>
                        ))}</span>
                        <span className='text-sm'>{`${ratings?.length} người đã xem và đánh giá`}</span>
                    </div>
                    <div className='flex-6 flex gap-2 flex-col p-4'>
                        {Array.from(Array(5).keys()).reverse().map(el => (
                            <Votebar
                                key={el}
                                number={el + 1}
                                ratingTotal={ratings?.length}
                                ratingCount={ratings?.filter(i => i.star === el + 1)?.length}
                            />
                        ))}
                    </div>
                </div>
                <div className='p-4 flex items-center justify-center text-sm flex-col gap-2'>
                    <span>Bạn đã xem qua sản phẩm này chưa?</span>
                    <Button handleOnClick={handleVoteNow}
                    >
                        Đánh giá
                    </Button>
                </div>
                <div className='flex flex-col gap-4'>
                    {ratings?.map(el => (
                        <Comment
                            key={el._id}
                            star={el.star}
                            updatedAt={el.updatedAt}
                            comment={el.comment}
                            name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default memo(ProductInfomation)