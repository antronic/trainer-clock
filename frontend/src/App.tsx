import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { useCallback, useEffect, useRef, useState } from 'react'

dayjs.extend(utc)
dayjs.extend(timezone)

function App() {
  const [localTz, setLocalTz] = useState(dayjs.tz.guess())
  const [selectedTz, setSelectedTz] = useState('Asia/Kolkata')

  const [time, setTime] = useState(1000)
  const timeout = useRef<number | null>(null)

  const [localTime, setLocalTime] = useState<Dayjs>(dayjs().tz(localTz))
  const [displayTime, setDisplayTime] = useState<Dayjs>(dayjs().tz(selectedTz))

  const [targetTime, setTargetTime] = useState<Dayjs>(dayjs().tz(selectedTz))
  const [targetTimeDisplay, setTargetTimeDisplay] = useState<Dayjs>(dayjs().tz(selectedTz))

  const [targetMinute, setTargetMinute] = useState(3)
  const timePickerRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const storedTime = localStorage.getItem('TRAINING_CLOCK_TIME')
    console.log('storedTime', storedTime)

    if (storedTime) {
      setTargetTime(dayjs(storedTime).tz(selectedTz))
    }
  }, [])

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setTime(time - 1)
      setDisplayTime(dayjs().tz(selectedTz))
      setLocalTime(dayjs().tz(localTz))
    }, 1000)

    return () => {
      if (time <= 0) {
        clearTimeout(timeout.current!)
      }
    }
  }, [time])

  // useEffect(() => {
  //   if (targetMinute > 0) {

  //   }
  // }, [targetMinute])

  useEffect(() => {
    // Target time is changed
    if (targetTime) {
      setTargetTimeDisplay(targetTime)
    }
  }, [targetTime])

  function handleSetTargetTime() {
    const targetInput = window.prompt('Set target minute', '15')

    if (targetInput) {
      const minute = parseInt(targetInput)

      setTargetMinute(minute)

      const newTargetTime = dayjs().tz(selectedTz).add(minute, 'minute')
      localStorage.setItem('TRAINING_CLOCK_TIME', newTargetTime.toISOString())
      setTargetTime(newTargetTime)
    }
  }

  return (
    <>

      <div className="h-screen w-full flex flex-col">
        {/*  */}
        {/* Nav */}
        <div className="flex justify-between items-center px-2 py-2 border-b text-xs">
          {/* Left panel */}
          <div className="flex gap-x-2">
            <div>
              <span className="">Display: </span>
              <span className="bg-black/25 px-2 py-1 rounded-lg">
                {selectedTz}
              </span>
            </div>
            <div>
              <span className="">Local: </span>
              <span className="bg-black/25 px-2 py-1 rounded-lg">
                {localTz}
              </span>
            </div>

          </div>
          {/* Right panel */}
          <div className="flex gap-x-2">
            <span>
              LocalTime: {localTime.format('HH:mm:ss')}
            </span>
          </div>
        </div>


        {/* Content */}
        <div className="flex-1 p-2">
          <p className="font-lg">
            Now: {displayTime.format('HH:mm:ss')}
          </p>

          <p className="text-[2rem]">
            Remaining ({targetMinute}):
            <span className="ml-2"></span>
            {targetTimeDisplay.diff(displayTime, 'seconds')} seconds
          </p>
          <div className="flex items-center">
            <span className="mr-2">Set:</span>
            <div className="flex gap-x-2">
              <button onClick={handleSetTargetTime} className="px-4 py-1 bg-black/25 hover:bg-black/50 rounded-lg text-sm">
                Min
              </button>

              <input ref={timePickerRef} type="time" className="rounded-lg px-2" />

              <button onClick={() => {
                timePickerRef.current?.click()
              }} className="px-4 py-1 bg-black/25 hover:bg-black/50 rounded-lg text-sm">
                Time
              </button>
            </div>
          </div>

          <p>
            Target: {targetTimeDisplay.format('HH:mm:ss')}
          </p>

          {/* <p>
            End: 12.08PM
          </p> */}

          <div className="text-2xl font-bold mt-4">
            <div className="text-[2rem] font-bold my-2 marquee text-left">
              <span>Thank you for your participantion! See you later!!🎉</span>
              {/* <span>Study time!</span> */}
              {/* <span className="bg-black/25 py-2 text-center">15 mins break</span> */}
            </div>
            <hr />
            <p className="mt-4">Todos</p>
            <ul className="list-disc list-inside text-xl">
              <li>High cardinality</li>
              <li>Non-monotonically increasing</li>
              <li>Low Frequency</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
