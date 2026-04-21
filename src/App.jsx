import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [query, setQuery] = useState('부산 동구 맛집')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchRestaurants = async () => {
    setLoading(true)
    setError(null)
    
    // 로컬 개발 환경에서의 CORS 문제 해결을 위한 프록시
    // 다양성을 위해 검색어 뒤에 랜덤 카테고리 추가
    const categories = ['맛집', '카페', '노포', '디저트', '분식', '일식', '한식']
    const randomCat = categories[Math.floor(Math.random() * categories.length)]
    const finalQuery = `${query} ${randomCat}`

    // [현업 정석 방식] 우리 서버(3001번)에게 데이터 요청하기
    // 이제 외부 프록시 사이트가 필요 없습니다!
    const apiUrl = `http://localhost:3001/api/search`

    try {
      const response = await axios.get(apiUrl, {
        params: { 
          query: finalQuery, 
          display: 100, 
          start: 1 
        }
      })
      
      // 검색 결과를 무작위로 섞기
      const shuffled = response.data.items.sort(() => Math.random() - 0.5)
      const selectedItems = shuffled.slice(0, 6)
      setResults(selectedItems)

      // 서버에 데이터를 보내 파일로 저장하기
      try {
        await axios.post('http://localhost:3001/api/save', selectedItems)
        console.log('로컬 파일에 데이터 저장 완료!')
      } catch (saveErr) {
        console.warn('저장 서버가 꺼져있을 수 있습니다:', saveErr.message)
      }

    } catch (err) {
      console.error(err)
      setError('CORS 프록시 접근 권한이 필요하거나 API 호출에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 초기 검색
  useEffect(() => {
    // 사용자가 프록시 권한을 얻어야 할 수도 있으므로 자동 실행은 지양하거나 안내 필요
  }, [])

  return (
    <div className="container">
      <header className="header">
        <div className="badge">Lesson 02</div>
        <h1>🍱 부산 동구 맛집</h1>
        <p>네이버 API와 리액트로 만드는 실시간 맛집 검색</p>
      </header>

      <div className="search-box">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button className="btn" onClick={searchRestaurants}>검색하기</button>
      </div>

      {error && (
        <div className="error-msg">
          ⚠️ {error} <br />
          <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noreferrer">
            프록시 활성화하러 가기
          </a>
        </div>
      )}

      <div className="results-grid">
        {loading ? (
          <div className="loading">데이터를 불러오고 있습니다...</div>
        ) : (
          results.map((item, index) => (
            <div key={index} className="card">
              <div className="card-title">{item.title.replace(/<[^>]*>?/gm, '')}</div>
              <div className="card-category">{item.category}</div>
              <div className="card-address">📍 {item.address}</div>
              <a 
                href={`https://search.naver.com/search.naver?query=${encodeURIComponent(item.title.replace(/<[^>]*>?/gm, ''))}`} 
                target="_blank" 
                rel="noreferrer"
                className="card-link"
              >
                상세정보 보기
              </a>
            </div>
          ))
        )}
      </div>

      <hr className="divider" />

      <section className="board-section">
        <h2>📋 직원 추천 맛집 게시판</h2>
        <p>파이어베이스 연동 예정 구역입니다.</p>
        <div className="placeholder-board">
          게시판 기능은 파이어베이스 설정 후 구현됩니다.
        </div>
      </section>
    </div>
  )
}

export default App
