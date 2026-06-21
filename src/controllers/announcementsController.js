import {pool} from '../config/db.js';

const createAnnouncements = async (req, res) => {
  //res.json({message: "create announcements !"});
  const {title, content} = req.body;

  const result = await pool.query(`
  INSERT INTO announcements (admin_id, title, content)
  VALUES ($1, $2, $3)
  RETURNING *`,
  [req.user.id, title, content]);

  res.status(200).json({
    message: "Announcement created",
    announcements: result.rows[0]
  })

};

const getAnnouncements = async (req,res)=> {
 // res.json ({message: "get announcements"})
 const userId = req.user.id;

 const result = await pool.query(`SELECT * FROM announcements ORDER BY created_at DESC `)

 if(!result.rows[0]) {
  return res.status(404).json({
    error: "no announcement"
  })
 }
 res.status(200).json({
  message: "done",
  announcements: result.rows
 })

 }

const deleteAnnouncements = async (req,res) => {
  //res.json({message: "update Announcements status"})
  if(req.user.role !== 'admin') {
    return res.status (403).json({error: "Only admin can have acces"});
  }
  const announcementsId = req.params.id;

  const result = await pool.query(`
    DELETE FROM announcements
    WHERE id = $1
    RETURNING *`,[announcementsId])

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "not found"
      });
    };

    res.status(200).json({
      message: "announcement deleted successfully!",
      announcements: result.rows[0]
    });

    
}; 


export { createAnnouncements, getAnnouncements, deleteAnnouncements};