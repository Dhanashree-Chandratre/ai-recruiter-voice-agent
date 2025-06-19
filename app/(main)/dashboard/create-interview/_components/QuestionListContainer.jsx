import React from 'react'

function QuestionListContainer({ questionList }) {
  return (
    <div>
      <h2 className='font-bold text-lg mb-5'>Generated Interview Questions: </h2>
      <div className='p-5 border-gray-300 rounded'>
        {questionList?.map((item, index) => (
          <div key={index} className='p-4 border border-gray-300 mb-2 rounded-lg bg-white'>
            <h2 className='font-medium'>{item.question}</h2>
            <h2 className='text-primary text-sm'>Type: {item?.type}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionListContainer