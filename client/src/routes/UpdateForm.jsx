import React, { useContext, useEffect, useState } from 'react'
import ArticleForm from '../components/ArticleForm.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios.js'
import ErrorHandler from '../components/ErrorHandler.jsx'
import AuthContext from '../contexts/Auth.jsx'

function UpdateForm() {
  const navigator = useNavigate()
  const { token } = useContext(AuthContext)
  const { article_id } = useParams()
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  const updateArticle = (title, subtitle, text) => {
    axios
      .put(
        `/articles/${article_id}/update`,
        {
          title: title,
          subtitle: subtitle,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => navigator('/articles'))
      .catch(err => {
        console.log(err)

        setErr(err.response)
      })
  }

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
  }, [article_id])

  return (
    <div className="article__form-container f-md">
      {data ? (
        <ArticleForm
          formTitle={'Update.'}
          defaultTitle={data.Title}
          defaultText={data.Text}
          defaultSubtitle={data.Subtitle}
          err={err}
          onSubmit={updateArticle}
        />
      ) : (
        <ErrorHandler err={err} />
      )}
    </div>
  )
}

export default UpdateForm
