import axios from 'axios';

// Vercel 서버리스 함수 규격
export default async function handler(req, res) {
  // GET 요청의 쿼리 파라미터 가져오기
  const { query, display, start } = req.query;

  // 나의 네이버 비밀번호 (원래는 Vercel 설정창에 숨겨야 하지만, 테스트를 위해 일단 적어둡니다)
  const CLIENT_ID = 'QFkC3_hkPBOR1bKLwMhE';
  const CLIENT_SECRET = '1WCNw45iFh';

  try {
    // 네이버 API 직접 찌르기!
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: { query, display, start },
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    });
    
    // 네이버가 준 결과를 우리 리액트 화면으로 그대로 토스!
    res.status(200).json(response.data);
  } catch (error) {
    console.error('네이버 API 호출 실패:', error.message);
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' });
  }
}
