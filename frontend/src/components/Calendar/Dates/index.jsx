import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import server from '../../../server.json';
import './index.css'
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// 음식의 유통기한을 가져오기 위한 함수
// 
const getEvents = async (url) => {
  try {
    const data = await axios({
      method: 'GET',
      url: url,
      withCredentials: true,
      headers: { 
        accept: 'application/json'
      }
    })
    return data.data
  }
  catch (err) {
    console.log(url);
    console.log(`ERROR: ${err}`);
  }
}

export default function Dates({onChildClick, on7DayClick, onAllClick}) {
  const calendarRef = useRef(null)
  const [calendarData, setCalendarData]=useState([])

  useEffect(async()=>{
    const data= await getEvents(`${server.ip}/calendar/getEvents`)
    setCalendarData(data)
  },[])
  
  // 날짜와 이벤트가 클릭되었을 때 클릭된  날짜의 정보를 부모로 올려준다.
  const onDateClick = (info) => {
    onChildClick(info.dateStr)
  }
  const onEventClick = (info) => {
    onChildClick(info.event.startStr)
  }
  
  // 유통기한이 7일 남은 제품, 전체 제품에 대한 정보를 사용자가 클릭했다고 부모에게 알려준다.
  const [showExpire, setShowExpire] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleAllChange = () => {
    onAllClick()
    setShowAll(!showAll)
    setShowExpire(false)
  }

  const handleExpireChange = () => {
    on7DayClick()
    setShowExpire(!showExpire)
    setShowAll(false)
  }

    return(
      <Box>
        <FullCalendar
          ref={calendarRef}
          plugins={[ dayGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          events={calendarData}
          locale={'ko'}
          dateClick={onDateClick}
          eventClick={onEventClick}
          className="calendar"
          >
        </FullCalendar>
        <Box my={1}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={showExpire} onChange={handleExpireChange} />}
              label="유통기한 7일 이하인 식재료 모두 보기"
            />
            <FormControlLabel
              control={<Checkbox checked={showAll} onChange={handleAllChange} />}
              label="전체 리스트 보기"
            />
          </FormGroup>
        </Box>
      </Box>
    )
  }