import express from 'express'
import cors from 'cors'
import fs from 'fs'
import axios from 'axios'

const app = express()
app.use(cors())
app.use(express.json())

// 네이버 API 키 (보안을 위해 서버로 이동!)
const CLIENT_ID = 'QFkC3_hkPBOR1bKLwMhE'
const CLIENT_SECRET = '1WCNw45iFh'

const SAVE_PATH = 'C:/러닝크루_새폴더/results.json'

// [현업 방식] 네이버 검색 대행 API
app.get('/api/search', async (req, res) => {
  const { query, display, start } = req.query
  
  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: { query, display, start },
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    })
    // 결과를 리액트에게 전달
    res.json(response.data)
  } catch (error) {
    console.error('네이버 API 호출 실패:', error.message)
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' })
  }
})

// 데이터 저장 API
app.post('/api/save', (req, res) => {
  const data = req.body
  try {
    fs.writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2), 'utf-8')
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`현업 정석 서버가 http://localhost:${PORT} 에서 실행 중입니다.`)
})
