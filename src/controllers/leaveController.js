import {pool} from '../config/db.js';

const createLeaves = async (req, res) => {
  //res.json({message: "leaves has been created successfully!"});
  const {start_date, end_date, reason} = req.body;

  const result = await pool.query(`
    INSERT INTO leaves (user_id, start_date, end_date, reason)
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [req.user.id, start_date, end_date, reason]
  )

  res.status(200).json({
    message: "done",
    leave: result.rows[0]
  })
};

const getMyLeaves = async (req,res) => {
  //res.json({message: "get My leaves works"});
  const userId = req.user.id;

  const result = await pool.query(`
    SELECT * FROM leaves WHERE user_id = $1`,
  [userId]);

  res.status(200).json({
    leaves: result.rows
  });
};

const getAllLeaves = async (req,res) => {
  //res.json ({message: "get all leaves works!"});
  if (req.user.role !== 'admin') {
    return res.status(403).json({error: "not allowed"});
  }

  const result = await pool.query(`
    SELECT * FROM leaves`);

  res.status(200).json({leaves: result.rows})
};

const updateLeavesStatus = async (req, res) => {
  //res.json({message: "update leaves status works !"})

  const leaveId = req.params.id;
  const  {status} = req.body;

  const result  = await pool.query ( ` UPDATE leaves 
    SET status = $1
    WHERE id = $2
    RETURNING *`,
    [status, leaveId]  )

  if (!result.rows[0]) {
    return res.status(403).json({
      error: "ticket not found"
    })
  }

  res.status(200).json({
    message: "demand updated!",
    leave: result.rows[0]
  })
}

export { createLeaves, getMyLeaves, getAllLeaves, updateLeavesStatus };