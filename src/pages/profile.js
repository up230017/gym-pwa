import React from 'react';
import EditProfile from '../components/profile/EditProfile';
import { authMiddleware } from '../utils/auth';

const ProfilePage = () => {
  return <EditProfile />;
};

export const getServerSideProps = authMiddleware(async (context) => {
  return {
    props: {},
  };
});

export default ProfilePage;