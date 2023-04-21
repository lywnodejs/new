import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Circle, Image, Text, Group } from "react-konva";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { funcDetailProps } from "../../../settings/projectMockData";

interface ReactKonvaProps {
  height?: number;
  width?: number;
  funcs: funcDetailProps;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "70%",
      minHeight: 300,
      display: 'flex',
    },
    info: {
      width: '100%',
      backgroundColor: '#F5F7FA',
      padding: 10,
      margin: 10,
      borderRadius: 10,
    },
    description: {
      fontSize: 16,
    }
  })
);
const KonvaImage = ({ x, y, image, width, handleSetScale }) => {
  const canvasImageSouce = new window.Image();
  canvasImageSouce.src = image;
  const height = (canvasImageSouce.height / canvasImageSouce.width) * width;
  const scale = width / canvasImageSouce.width
	handleSetScale(scale)

  return (
    <Image x={x} y={y} image={canvasImageSouce} width={width} height={height} />
  );
};

export const ReactKonva: React.FC<ReactKonvaProps> = ({
  width = 500,
  height = 500,
  funcs,
}) => {
  const classes = useStyles();
  const circle = useRef([] as any);
  const [size, setSize] = useState({
    width,
    height,
  });
	const [scale, setScale] = useState(1)
  const [isHover, setIsHover] = useState( false )
  const [hoverItem, setHoverItem] = useState(funcs.func[0])

	const handleSetScale = (scale) => {
		setScale(scale)
	}

  useEffect(() => {
    const container = document.querySelector("#stage-parent") as HTMLElement;
    setSize({
      width: container.offsetWidth-250,
      height: container.offsetHeight,
    });
    console.log('ref', circle)
  }, []);

  useEffect(() => {
    let period = 20000;
    let offset = 100;
    let animations = [] as any;
    circle.current.map((c, idx) => {
      console.log(c)
      let anim = new Konva.Animation(frame => {
        if(frame){
          if(frame.time > 2000){
 
            frame.time = 0;
          }
          
          let s = ((frame.time + offset * idx) * 2 * Math.PI) / period + 0.001;
          c.scale({x: s, y: s})
        }
      }, c.getLayer());
      anim.start();
      animations.push(anim)
    })
    // let anim = new Konva.Animation(frame => {
    //   if(frame){
    //     let s = Math.sin((frame.time * 2 * Math.PI) / period) + 0.001
    //     circle.current[0].scale({x: s, y: s})
    //   }
    // }, circle.current[0].getLayer());
    // anim.start();
    // animations.push(anim)
    return () => {
      animations.map(el=> el.stop())
      // anim.stop()
    };
  }, []);

  const handleMouseEnter = item => {
    setIsHover(true)
    setHoverItem(item)
  }

  const handleMouseOut = () => {
    setIsHover(false)
  }

  return (
    <div className={classes.root} id="stage-parent">
      <Stage size={size}>
        <Layer>
          {/* <Image x={0} y={0} image={funcs.image} /> */}
          <KonvaImage x={0} y={0} image={funcs.image} width={size.width} handleSetScale={handleSetScale} />
        </Layer>
				
        <Layer>
					{
						funcs.func.map((el, idx) => {
							return (
                <>
                  <Rect x={el.rect[0] * scale} y={el.rect[1] * scale} width={el.rect[2] * scale} height={el.rect[3] * scale} onMouseEnter={e=>handleMouseEnter(el)} onMouseOut={handleMouseOut} stroke={isHover && (el === hoverItem )? '#4b9fea':'#ffc570'} cornerRadius={10}/>
                  <Group  >
                    {
                      [5, 20, 50].map((num, numIdx) => {
                        return (
                          <Circle x={(el.rect[0] * scale)+(el.rect[2] * scale / 2)} y={(el.rect[1] * scale)+(el.rect[3] * scale / 2)} radius={num} stroke='#f9f9f9'  ref={r => circle.current[idx*3+numIdx]=r} />
                        )
                      })
                    }
                  </Group>
                </>
							)
						})
					}
          {
            // isHover && (
            //   <>
            //     {/* <Rect x={hoverItem.rect[0] * scale} y={hoverItem.rect[1] * scale} width={50} height={50} fill="red" /> */}
                
            //     <Text text={hoverItem.title} x={hoverItem.rect[0] * scale} y={hoverItem.rect[1] * scale} fontSize={18} fill='#555' width={300} padding={20} align='center' />
            //   </>
            // )
          }
          {
            // isHover && (
            //   <>
            //     <Rect x={0} y={0} width={300} height={150} fill="#4b9feaee" cornerRadius={20} />
                
            //     <Text text={hoverItem.title} x={0} y={0} fontSize={18} fill='#fff' width={300} padding={20} align='center' />
                
            //     <Text text={hoverItem.description} x={0} y={50} fontSize={18} fill='#fff' width={300} padding={20} align='center' />
            //   </>
            // )
          }
        </Layer>
      </Stage>
      
      <div className={classes.info}>
      {
        isHover && (
          <>
            <h2>{hoverItem.title}</h2>
            <div className={classes.description}>
              {hoverItem.description}
            </div>
          </>
        )
      }
      </div>
    </div>
  );
};
