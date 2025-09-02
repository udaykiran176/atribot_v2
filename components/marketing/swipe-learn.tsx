
import Image from 'next/image';

const SwipeLearn = () => {
    return (
        <div className='mx-auto flex w-full max-w-[988px] flex-1 flex-row items-center justify-center gap-10 p-8 '>
            <div>
                <Image src="/home_img/Swipe-Learn.jpeg" alt="Video Lessons" width={500} height={500} />
            </div>
            <div>
                <h2 className='text-2xl font-bold text-neutral-600'>Swipe Learn</h2>
                <p className='text-sm text-neutral-600'>Quick flashcards and swipes to learn robotics concepts.</p>
            </div>
          
        </div>
    );
};

export default SwipeLearn;
