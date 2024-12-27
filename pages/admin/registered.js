import React from 'react'

import Layout from '../../component/Layout'
import "../../src/app/styles/main.scss";
import RegisteredUser from '../RegisteredUser/[eventId]';


const Register = () => {
    return (
        <div>
            <Layout>
                <RegisteredUser/>
            </Layout>
           
        </div>
    )
}

export default Register
