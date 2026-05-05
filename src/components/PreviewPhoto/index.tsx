/**
 * 预览图片
 */
import React, { useState } from 'react';
import type { FC } from 'react';
import { PhotoSlider } from 'react-photo-view';
import './index.less';


interface PreviewPhotoProps {
  fileUrl?: string;
  fileName?: string
}

const PreviewPhoto: FC<PreviewPhotoProps> = (props) => {
  const { fileUrl, fileName } = props;
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [visible, setVisible] = useState(false);


  /**
   * 放大、缩小
   * @param scaling 放大、缩小倍数
   */
  const onScale = (scaling: number) => {
    const scaled: number = Number(scaling.toFixed(2));
    console.log('scaled----', scaled)
    setScale(scaled);

    if (naturalWidth === 0) {
      const dom = document.getElementById('previewPhotoImg');
      if (dom) {
        const domWidth = dom?.naturalWidth;
        const domHeight = dom?.naturalHeight;
        setNaturalWidth(domWidth);
        setNaturalHeight(domHeight);
        setWidth(domWidth * scaled);
        setHeight(domHeight * scaled);
      }
    } else {
      setTimeout(() => {
        setWidth(naturalWidth * scaled);
        setHeight(naturalHeight * scaled);
      }, 500)
    }
  }
  /**
   * 旋转
   * @param rotating 旋转角度
   */
  const onRotate = (rotating: number) => {
    setRotate(rotating);
  }

  /**
   * 鼠标向上滚动
   */
  const scrollUp = () => {
    if (scale < 3) {
      onScale(scale + 0.2);
    }
  }
  /**
   * 鼠标向下滚动
   */
  const scrollDown = () => {
    if (scale > 0.2) {
      onScale(scale - 0.2);
    }
  }

  /**
   * 监听鼠标滚动事件
   * @param event 鼠标事件
   */
  const scrollFunc = (event: any) => {
    const e = event || window.event;

    if (e.wheelDelta) {
      if (e.wheelDelta > 0) {
        scrollUp();
      }
      if (e.wheelDelta < 0) {
        scrollDown();
      }
    } else if (e.detail) { //Firefox 滑轮事件
      if (e.detail > 0) {
        scrollUp();
      }
      if (e.detail < 0) {
        scrollDown();
      }
    }
  }

  //给页面绑定滑轮滚动事件  
  if (document.addEventListener) {//firefox  
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
  }
  //滚动滑轮触发scrollFunc方法  //ie 谷歌  
  window.onmousewheel = document.onmousewheel = scrollFunc;

  const isIEArr = navigator.userAgent.match(/MSIE (\d)/i);
  const isIE = isIEArr ? isIEArr[1] : 11;
  const isFF = /FireFox/i.test(navigator.userAgent);
  const counter = document.getElementById('preview-img-box');
  if (counter) {
    //鼠标滚轮事件
    if (isIE < 9) { //传统浏览器使用MouseWheel事件
      counter.attachEvent("onmousewheel", function () {
        //阻止浏览器默认方法
        return false;
      });
    } else if (!isFF) { //除火狐外的现代浏览器也使用MouseWheel事件
      counter.addEventListener("mousewheel", function (e) {
        //阻止浏览器默认方法
        e.preventDefault();
      }, false);
    } else { //奇葩的火狐使用DOMMouseScroll事件
      counter.addEventListener("DOMMouseScroll", function (e) {
        //阻止浏览器默认方法
        e.preventDefault();
      }, false);
    }
  }

  return (
    <>
      <p className="previewPhoto-toolbar">
        <span className="toolbar-scale" style={{
          backgroundColor: scale <= 0.2 ? '#80BEE8' : '#007dd0',
          marginLeft: 0,
          cursor: scale <= 0.2 ? 'default' : 'pointer'
        }}>
          <svg t="1634613757322" class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4087"
            width="8"
            height="8"
            fill={'#fff'}
            onClick={() => scale > 0.2 && onScale(scale - 0.2)}
          >
            <path d="M0 384m128 0l768 0q128 0 128 128l0 0q0 128-128 128l-768 0q-128 0-128-128l0 0q0-128 128-128Z" p-id="4088"></path>
          </svg>
        </span>
        <span style={{ color: '#333' }}> {`${Math.floor(scale * 100)}%`} </span>
        <span className="toolbar-scale" style={{
          backgroundColor: scale >= 3 ? '#80BEE8' : '#007dd0',
          cursor: scale >= 3 ? 'default' : 'pointer'
        }}>
          <svg t="1634613459947" class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3958"
            width="8"
            height="8"
            fill={'#fff'}
            onClick={() => scale < 3 && onScale(scale + 0.2)}
          >
            <path d="M512 0a128 128 0 0 1 128 128v256h256a128 128 0 1 1 0 256H640v256a128 128 0 1 1-256 0l-0.128-256H128a128 128 0 1 1 0-256h256V128a128 128 0 0 1 128-128z" p-id="3959"></path>
          </svg>
        </span>
        <span style={{ color: '#D8D8D8' }}> | </span>
        <svg t="1634613808862" class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4218"
          width="14"
          height="14"
          fill="#333"
          onClick={() => onRotate(rotate - 90)}
        >
          <path d="M658.285714 438.857143a73.142857 73.142857 0 0 1 73.142857 73.142857v438.857143a73.142857 73.142857 0 0 1-73.142857 73.142857H73.142857a73.142857 73.142857 0 0 1-73.142857-73.142857V512a73.142857 73.142857 0 0 1 73.142857-73.142857h585.142857z m0 73.142857H73.142857v438.857143h585.142857V512zM512 0v107.373714l18.139429 1.536a548.717714 548.717714 0 0 1 491.739428 496.932572 36.571429 36.571429 0 1 1-70.436571 19.017143L950.857143 618.057143h-1.389714a475.501714 475.501714 0 0 0-437.394286-437.394286L512 329.142857 292.571429 164.571429 512 0z" p-id="4219"></path>
        </svg>
        <svg t="1634613866144" class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4346"
          width="14"
          height="14"
          fill="#333"
          onClick={() => setVisible(true)}
        >
          <path d="M329.142857 73.142857a36.571429 36.571429 0 0 1 0 73.142857H197.997714L512 460.288 825.929143 146.285714H694.857143a36.571429 36.571429 0 0 1-35.986286-29.988571L658.285714 109.714286a36.571429 36.571429 0 0 1 29.988572-35.986286L694.857143 73.142857H950.857143v256a36.571429 36.571429 0 0 1-72.557714 6.582857L877.714286 329.142857V197.924571L563.712 512 877.714286 826.002286V694.857143a36.571429 36.571429 0 1 1 73.142857 0V950.857143H694.857143a36.571429 36.571429 0 1 1 0-73.142857h131.145143L512 563.712 197.924571 877.714286H329.142857a36.571429 36.571429 0 0 1 35.986286 29.988571L365.714286 914.285714a36.571429 36.571429 0 0 1-29.988572 35.986286L329.142857 950.857143H73.142857V694.857143a36.571429 36.571429 0 0 1 72.557714-6.582857L146.285714 694.857143v131.072L460.288 512 146.285714 197.997714V329.142857a36.571429 36.571429 0 0 1-73.142857 0V73.142857h256z" p-id="4347"></path>
        </svg>
      </p>
      <div id="preview-img-box" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'scroll' }}>
        <img
          id="previewPhotoImg"
          src={fileUrl}
          width={width}
          height={height}
          alt={fileName}
          style={{
            'transform': `rotate(${rotate}deg)`,
            '-ms-transform': `rotate(${rotate}deg)`, 	/* IE 9 */
            '-moz-transform': `rotate(${rotate}deg)`, /* Firefox */
            '-webkit-transform': `rotate(${rotate}deg)`, /* Safari 和 Chrome */
            '-o-transform': `rotate(${rotate}deg)`
          }}
        />
      </div>
      {fileUrl && <PhotoSlider
        images={[{
          src: fileUrl
        }]}
        visible={visible}
        onClose={() => setVisible(false)}
      />}
    </>
  )
}

export default PreviewPhoto;