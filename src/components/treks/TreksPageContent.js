/* eslint-disable max-statements */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import SortDescription from './SortDescription';
import Trek from '../trek/Trek';
import AddTrekForm from './AddTrekForm';
import { addTrekToDb, addFilesToStorage, fetchRecentTreks } from '../../state/treks/treks.actions';
import PreLoader from '../pre-loader/PreLoader';
import CategorySelector from './CategorySelector';

const TreksPageContent = ({ sortDes, changeDes, treks, currentNav, profile, changeNav, addTrekToDb, addFilesToStorage, loading, fetchRecentTreks }) => {
  const [newTrekLoading, setNewTrekLoading] = useState(false);
  const getInputs = async (profile, trek) => {
    try {
      const newTrek = {
        ...trek,
        id: '',
        profileId: profile.id,
        username: profile.username,
        profile_pic: profile.photoURL,
        date_posted: Date.now(),
        comments: [],
        reports: [],
        reposts: [],
        likes: []
      };
      if (trek.privacy === 'public') {
        changeNav('recent');
        changeDes('Most recent Treks');
      } else {
        changeNav('private');
        changeDes('Treks only you can see');
      }
      setNewTrekLoading(true);
      const trekReadyToUpload = await addFilesToStorage(newTrek);
      const tb = { ...newTrek, images: trekReadyToUpload.images, videos: trekReadyToUpload.videos };
      await addTrekToDb(tb);
      const cn = trek.privacy === 'public' ? 'recent' : 'private';
      await fetchRecentTreks({ currentNav: cn, profile: profile, category: 'popular sites' }, () => null, () => setNewTrekLoading(false));
      setNewTrekLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
        <div className="trek-page-content center column">
            <SortDescription sortDes={sortDes} />
            {loading ? <PreLoader /> : (
              <>
              {currentNav === 'post' ? <AddTrekForm getInputs={(trek) => getInputs(profile, trek)} profile={profile} /> : (
                <div className="treks">
                  {newTrekLoading ? (
                    <>

                    <PreLoader />
                    <p className="medium-text bold c-cream text-center overpass">Uploading your trek</p>
                    </>
                  ) : null}
                  {currentNav === 'categories' ? (
                    <CategorySelector startLoading={() => setNewTrekLoading(true)} stopLoading={() => setNewTrekLoading(false)} />
                  ) : null}
                  {treks.map((key) => (
                    <div key={key.id} data-aos="fade-up">
                      <Trek trek={key} treks={treks} profile={profile} />
                    </div>
                  ))}
                  {treks.length < 1 && currentNav === 'private' ? (
                    <div className="w-100 center text-center">
                      <h3 className="heading small-caps overpass c-cream">You don&apos;t have Private Treks</h3>
                    </div>
                  ) : null}
                  {treks.length < 1 && currentNav === 'my treks' ? (
                    <div className="w-100 center text-center">
                      <h3 className="heading small-caps overpass c-cream">You don&apos;t have any Treks yet</h3>
                    </div>
                  ) : null}
                </div>
              )}
              </>
            )}
        </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile
});

const mapDispatchToProps = (dispatch) => ({
  addTrekToDb: (trek) => dispatch(addTrekToDb(trek)),
  addFilesToStorage: (trek) => dispatch(addFilesToStorage(trek)),
  fetchRecentTreks: (info, startLoading, stopLoading) => dispatch(fetchRecentTreks(info, startLoading, stopLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(TreksPageContent);
