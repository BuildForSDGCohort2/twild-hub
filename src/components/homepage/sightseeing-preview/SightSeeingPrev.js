import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AOS from 'aos';
import { navigate } from '@reach/router';
import TextContent from '../../TextContent';
import { getCategories } from '../../../state/sightseeing/sightseeing.actions';
import { stPrevData } from '../../../state/sightseeing/stData';
import LargeBtn from '../../LargeBtn';

const SightSeeingPrev = ({ siteCategories, getCategories }) => {
  const goToPage = () => navigate('sightseeing');
  useEffect(() => {
    getCategories(stPrevData);
    AOS.init({ once: true });
  }, [getCategories]);
  return (
      <>
        <section className="st-prev-sec w-100 p-3">
            <TextContent heading="Sightseeing" textColor="c-cream text-center" />
            <div className="gallery">
                {siteCategories.map((key) => (
                    <div className="gallery-item cursor"
                        key={key.name}
                        style={{ backgroundImage: `url(${key.poster})` }}
                        data-aos="zoom-in" data-aos-duration="500" >
                        <div className="gallery-text animate__animated animate__slideInDown">
                            <h1 className="medium-text animate__animated animate__rotateInDownLeft">{key.name}</h1>
                        </div>
                    </div>
                ))}
            </div>
            <LargeBtn textContent="Explore" activate={goToPage} extraClass="black mt-3" />
        </section>
</>
  );
};

const mapStateToProps = (state) => ({
  siteCategories: state.sightSeeing.siteCategories
});

const mapDispatchToProps = (dispatch) => ({
  getCategories: (siteCategories) => dispatch(getCategories(siteCategories))
});

export default connect(mapStateToProps, mapDispatchToProps)(SightSeeingPrev);
