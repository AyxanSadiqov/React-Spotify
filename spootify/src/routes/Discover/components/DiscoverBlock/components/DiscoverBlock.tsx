import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import DiscoverItem from './DiscoverItem';
import '../styles/_discover-block.scss';

//TODO: Fix types here

const scrollContainer = (id: any, { isNegative }: any = {}) => {
  return () => {
    const scrollableContainer: any = document.getElementById(id);
    const amount = isNegative ? -scrollableContainer.offsetWidth : scrollableContainer.offsetWidth;

    scrollableContainer.scrollLeft = scrollableContainer.scrollLeft + amount;
  };
}

function dataLength({data, id} : any) {
  return data[id].items.length
}

interface IDiscoverBlockProps {
  text: any;
  id: any;
  data: any;
}

export default class DiscoverBlock extends React.Component<IDiscoverBlockProps> {
  render = () => {
    const { text, id, data } = this.props;

    return (
      // her api sonucundan donen key "id"-ye atandi. dinamik olarak kontroller bu degisken ile saglandi
      data[id] !== undefined ? (
        <div className="discover-block">
          <div className="discover-block__header">
            <h2>{text} ({dataLength({data, id})})</h2>
            <span />
            {
              {dataLength} ? (
                <div className="animate__animated animate__fadeIn">
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    onClick={scrollContainer(id, { isNegative: true })}
                  />
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={scrollContainer(id)}
                  />
                </div>
              ) : null
            }
          </div>
          {
            id !== 'categories' ? (
              <div className="discover-block__row" id={id}>
                {data[id].items.map(({ id, images, name }: any) => (
                  <DiscoverItem key={id} images={images} name={name} />
                ))}
              </div>
            ) : // "Get Several Browse Categories" api-sinden "images" yerine "icons" key-i geldigi icin bu kosul eklendi. map sirasinda "image" yerine "icon" gonderiliyor
              <div className="discover-block__row" id={id}>
                {data[id].items.map(({ id, icons, name }: any) => (
                  <DiscoverItem key={id} images={icons} name={name} />
                ))}
              </div>
          }
        </div>
      ) : ''
    );
  }
}
