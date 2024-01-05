"use client"
import * as RedixSlider from '@radix-ui/react-slider'

interface SliderProps{
    value?:number;
    onChange?:(value: number) =>void ;
}

const Slider: React.FC<SliderProps> = ({value=1 , onChange}) => {

    const handleChange = (newValue : number[]) =>{
        onChange?.(newValue[0]);
    }

  return (
   <RedixSlider.Root
    className='relative flex items-center select-none touch-none w-full h-10'
    defaultValue={[1]}
    value={[value]}
    onValueChange={handleChange}
    max={1}
    step={0.1}
    aria-label="volume"
   >
    
    <RedixSlider.Track
        className='bg-neutral-600 relative grow rounded-full h-[3px] '
    >
        <RedixSlider.Range
         className='absolute bg-white rounded-full h-full '
        >

        </RedixSlider.Range>
    </RedixSlider.Track>


   </RedixSlider.Root>
  )
}

export default Slider