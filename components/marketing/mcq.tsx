
import Image from 'next/image';

const MCQ = () => {
    return (
        <div className='mx-auto flex w-full max-w-[988px] flex-1 flex-row items-center justify-center gap-10 p-8 '>
             <div>
                <h2 className='text-2xl font-bold text-neutral-600'>MCQ Tests</h2>
                <p className='text-sm text-neutral-600'>Test your knowledge with fun quizzes.</p>
            </div>
            <div>
                <Image src="/home_img/MCQ-Tests.jpeg" alt="Video Lessons" width={500} height={500} />
            </div>
          
        </div>
    );
};

export default MCQ;
