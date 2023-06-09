import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useState,useEffect } from 'react'
import NavBarDashBoard from '../../NavBar/NavBarDashboard';
import { FormContainer } from '../../Forms/FormContainer';

import { FloatingLabel } from 'react-bootstrap';

import { useNavigate, useLocation } from 'react-router-dom'

const EditMail = () => {
    const [admins, setAdmins] = useState([])
    const [subject, setSubject] = useState('')
    const [days, setDays] = useState('')
    const [body, setBody] = useState('')
    const [receiverId, setReceiverId] = useState('')
    const [err, setErr] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    const { senderId, senderName, mail_id } = location.state || {}

    useEffect(() => {
        axios.post('https://leaveapp-api.onrender.com/mails/find', { _id: mail_id })
            .then(response => {
                const mail = response.data
                console.log(mail)
                setSubject(mail.subject)
                setDays(mail.days)
                setBody(mail.body)
                setReceiverId(mail.receiverId)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
		axios.post("https://leaveapp-api.onrender.com/students/sameschooladmins", { _id: senderId })
		.then(response => {
			const admins_received = response.data
			setAdmins(admins_received)
            if (admins?.length === 1) {
                setReceiverId(admins[0]._id)
            }
		})
		.catch(error => {
			console.log(error)
		})
	})

    const handleUpdate = (e) => {
        e.preventDefault()

        if (!receiverId?.length) {
            console.log(receiverId)
            return setErr('Can\'t send application as no receiver can be found.')
        }

        axios.patch('https://leaveapp-api.onrender.com/mails', { _id: mail_id, subject, days, body, receiverId })

            .then(response => {
                console.log(response)
                navigate('/student', { state: { student_id: senderId, student_name: senderName }})
            })
            .catch(error => {
                console.log(error)
                setErr(error.response.data.message)
            })
    }

    const handleSelectAdmin = (e) => {
		setReceiverId(e.target.value)
	}

    return (
        <div>
            <div className='bagc'>
            <NavBarDashBoard
                student_id={senderId}
                admin_id=''
            />

       <div className="justify-content-center">
       <div className='dashboard_bg'>
	<div className='dashboard_overlay'>
	
    <div className='container'>
            <h2 className='form_head1'>Edit your mail</h2>
            <hr className='mb-3'/>
            <Form>
                <Form.Group controlId='subject'></Form.Group>
                <Form.Label className='days2'><h5>Subject</h5></Form.Label>
                <Form.Control 
                    type='text'
                    name='subject'
                    value={subject}
                    onChange={(e)=>setSubject(e.target.value)}
                />
                
            <div className='sender_days'>
            <Form.Label ><h6 className='days'>Receiver</h6></Form.Label>
                    <Form.Select value={receiverId} onChange={handleSelectAdmin}>
                        {admins?.length ? (
                            admins.map(admin=>(
        
                                <option className='admin_box' key={admin._id} value={admin._id} > {admin.name} </option>
                            ))
                            ) : <option disabled selected value=''>No admin found for this school</option>
                        }
                    </Form.Select>

                <Form.Group controlId='days'></Form.Group>
                <Form.Label ><h6 className='days'>Days</h6></Form.Label>
                <Form.Control 
                    type='digit'
                    name='days'
                    value={days}
                    onChange={(e)=>setDays(e.target.value)}
                />
                 
                </div>
                

                <Form.Group controlId='body'> </Form.Group>
                <Form.Label className='days1'><h5>Application Body</h5></Form.Label>

                <FloatingLabel controlId="Mail Body" label="Application Body">
                    <Form.Control
                        as="textarea" 
                        value={body} 
                        onChange={(e)=>setBody(e.target.value)}
                        placeholder="write your mail here"
                        style={{ height: '300px' }}
                    />
                </FloatingLabel>

               

            </Form>

                { err ? <p>{err}</p> : <></> }

                {admins?.length ? (
                    <Button className='primary' onClick={handleUpdate}><div className='subhead1'>Update Mail</div></Button>
                ) : <Button variant='secondary' dislabled><div classNmae='subhead1'>Update Mail</div></Button>}
            

        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
   
    )
}

export default EditMail
