
import Image from 'next/image';

const VideoLessons = () => {
    return (
        <div className='mx-auto flex w-full max-w-[988px] flex-1 flex-row items-center justify-center gap-10 p-8 '>
            <div>
                <h2 className='text-2xl font-bold text-neutral-600'>Video Lessons</h2>
                <p className='text-sm text-neutral-600'>Watch our video lessons to learn robotics concepts step by step.</p>
            </div>
            <div>
                <Image src="/home_img/Video-Lessons.jpeg" alt="Video Lessons" width={500} height={500} />
            </div>
        </div>
    );
};

export default VideoLessons;
