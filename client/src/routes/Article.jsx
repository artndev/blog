import '../styles/css/Article.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ArticleFront from '../components/ArticleFront.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios.js'
import AdminContext from '../contexts/Admin.jsx'
import AuthContext from '../contexts/Auth.jsx'
import heart from '../imgs/heart.svg'
import bookmark from '../imgs/bookmark.svg'
import pen from '../imgs/pen.svg'
import bin from '../imgs/bin.svg'
import Button from '../components/Button.jsx'
import ErrorHandler from '../components/ErrorHandler.jsx'

function Article() {
  const navigator = useNavigate()
  const { token } = useContext(AuthContext)
  const { admin } = useContext(AdminContext)
  const { article_id } = useParams()
  const [data, setData] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [err, setErr] = useState(null)

  // GET / DELETE requests don't need blank curly brackets
  // ========= DATA =========
  useEffect(() => {
    axios
      .get(`/articles/${article_id}`)
      .then(response => {
        setData(response.data.answer)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }, [article_id, isLiked])

  const deleteArticle = () => {
    axios
      .delete(`/articles/${article_id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => navigator('/articles'))
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }

  // ========= REACTIONS =========
  useEffect(() => {
    axios
      .get(`/likes/${article_id}/state`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setIsLiked(response.data.answer)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }, [article_id])

  const likeArticle = () => {
    if (isLiked) return

    axios
      .post(
        `/likes/${article_id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setIsLiked(true)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }

  const dislikeArticle = () => {
    if (!isLiked) return

    axios
      .post(
        `/likes/${article_id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setIsLiked(false)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }

  // ========= SAVES =========
  useEffect(() => {
    axios
      .get(`/saves/${article_id}/state`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setIsSaved(response.data.answer)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }, [article_id])

  const saveArticle = () => {
    if (isSaved) return

    axios
      .post(
        `/saves/${article_id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setIsSaved(true)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }

  const unsaveArticle = () => {
    if (!isSaved) return

    axios
      .post(
        `/saves/${article_id}/unsave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setIsSaved(false)
      })
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  // useEffect(() => {
  //   console.log(err)
  // }, [err])

  return (
    <div className="article__container f-md">
      {data ? (
        <div className="article">
          <ArticleFront
            title={data.Title}
            subtitle={new Date(data.Updated)
              .toLocaleDateString()
              .replaceAll('.', '/')}
            text={data.Text}
          />
          <div className="article__btns">
            <div className="article__btns-group">
              <Button
                isPressed={isLiked}
                isInverted={true}
                onClick={() => {
                  if (!token) {
                    navigator('/login')
                    return
                  }

                  if (isLiked) {
                    dislikeArticle()
                    return
                  }

                  likeArticle()
                }}
                width={35}
                height={35}
                content={<img src={heart} alt="Like" />}
              />
              <div>
                {Intl.NumberFormat('en', { notation: 'compact' }).format(
                  data.Likes
                )}
              </div>
            </div>
            <Button
              isPressed={isSaved}
              isInverted={true}
              onClick={() => {
                if (!token) {
                  navigator('/login')
                  return
                }

                if (isSaved) {
                  unsaveArticle()
                  return
                }

                saveArticle()
              }}
              width={35}
              height={35}
              content={<img src={bookmark} alt="Like" />}
            />
            {admin && (
              <>
                <Button
                  isInverted={true}
                  onClick={() => navigator(`/articles/${article_id}/update`)}
                  width={35}
                  height={35}
                  content={<img src={pen} alt="Update" />}
                />
                <Button
                  isInverted={true}
                  onClick={() => deleteArticle()}
                  width={35}
                  height={35}
                  content={<img src={bin} alt="Delete" />}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <ErrorHandler err={err} />
      )}
    </div>
  )
}

export default Article
