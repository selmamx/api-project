import { pool } from "../config/db.js";



const createTicket = async(req, res) =>{
  const {title, description} = req.body;
  

  const result = await pool.query(
    `INSERT INTO tickets (user_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [req.user.id, title, description]
  )

  res.status (201).json ({
     message: "ticket created successfully", 
    ticket: result.rows[0]
  });

};


const getMyTickets = async(req,res)=>{
  //res.json({message: "get my tickets"})
  const user_id = req.user.id;
   
  const result = await pool.query (
  `SELECT *  FROM tickets WHERE user_id=$1`,
  [user_id]
  );
  
  res.status(200).json ({
    tickets: result.rows
  });

};

const getTicketById = async (req,res) => {
  //res.json({message: "get ticket by Id"})
  const ticketId = req.params.id;
  const userId = req.user.id;
  const result = await pool.query (
    `SELECT * FROM tickets WHERE id= $1 and user_id = $2`,
    [ticketId, userId]
  );

  if(!result.rows[0]) {
    return res
    .status(404)
    .json({error: "Ticket not found"});
  }

  res.status(200).json ({
    ticket: result.rows[0]
  });
};

const deleteTicket = async (req,res) => {
  //res.json({message: "delete Ticket"});
  const ticketId = req.params.id;
  const result = await pool.query(`
    DELETE FROM tickets WHERE id = $1 RETURNING *
    `, [ticketId]);

    if (!result.rows[0]){
      return res.status(404).json({
        error: "ticket not found"
      })
    }
    res.status(200).json({
      message: " ticket deleted successfully"
    })
};

/*const updateTicketStatus = async (req, res) => {
  //res.json({ message: "update ticket status" });
  const ticketId = req.params.id;
  const {status} = req.body;

  const result = await pool.query(`
    UPDATE tickets
    SET STATUS = $1
    WHERE id = $2
    RETURNING *`,
  [status, ticketId]);

  if (!result.rows[0]) {
     return res.status(404).json({
      error: " ticket not found"
    })
  }
  res.status(200).json({
    message: "Ticket status updated",
    ticket: result.rows[0]
  });
};
*/

const requestStatusChange = async(req,res) => {
  const ticketId = req.params.id;
  const {requested_status} = req.body;
  const userId = req.user.id;

  const result = await pool.query(`
    UPDATE tickets 
    SET requested_status = $1
    WHERE id = $2 AND user_id = $3
    RETURNING*`,
    [requested_status, ticketId, userId]
  );

  if (!result.rows[0]) {
    return res.status(404).json({error: "Ticket not found"});
  }

  res.status(200).json ({
    message: "Status change requested, waiting for admin approval",
    ticket: result.rows[0]
  });
};

const approveStatusChange = async (req,res)=> {
  if(req.user.role !== 'admin') {
    return res.status (403).json({error: "Only admin can approve"});
  }
  const ticketId = req.params.id;

  const result = await pool.query (`
    UPDATE tickets
    SET status = requested_status, requested_status=NULL
    WHERE id =$1
    RETURNING*`,
  [ticketId]
  );

  if (!result.rows[0]) {
    return res.status(404).json ({ error: "Ticket not found"});
  }
  res.status(200).json({
    message: "Status change approved",
    ticket: result.rows[0]
  });
};

const rejectStatusChange = async (req,res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({error: "Only admin can reject"});
  }
  const ticketId = req.params.id;
  const result = await pool.query(`
    UPDATE tickets 
    SET requested_status = NULL 
    WHERE id = $1
    RETURNING *`,
  [ticketId]);

  if (!result.rows[0]) {
    return res.status(404).json({error: "Ticket not found"});
  }

  res.status(200).json ({
    message: "Status change  rejected",
    ticket: result.rows[0]
  });
}
export {createTicket, getMyTickets, getTicketById, deleteTicket, rejectStatusChange, approveStatusChange, requestStatusChange};