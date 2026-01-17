const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const sequelize = new Sequelize("news", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Models
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "author"),
    defaultValue: "user",
  },
});

const News = sequelize.define("News", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: "https://via.placeholder.com/600x400?text=News+Image",
  },
});

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Relationships
User.hasMany(News, { foreignKey: "authorId" });
News.belongsTo(User, { as: "author", foreignKey: "authorId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { as: "user", foreignKey: "userId" });

News.hasMany(Comment, { foreignKey: "newsId", onDelete: "CASCADE" });
Comment.belongsTo(News, { foreignKey: "newsId" });

// Seed Data
const seedDatabase = async () => {
  try {
    const count = await User.count();
    if (count === 0) {
      console.log("Seeding database...");
      const hash = await bcrypt.hash("password123", 10);

      // Users
      const admin = await User.create({ name: "Super Admin", email: "admin@example.com", password: hash, role: "admin" });
      const author = await User.create({ name: "Alice Rahman", email: "alice@example.com", password: hash, role: "author" });
      const reader = await User.create({ name: "Karim Reader", email: "karim@example.com", password: hash, role: "user" });

      // News
      const newsData = [
        {
          title: "Dhaka Metro Rail Expansion Approved",
          body: "The government has approved the phase 2 expansion of the Dhaka Metro Rail project, aiming to connect new areas of the city by 2028. This will significantly reduce traffic congestion.",
          image: "https://images.unsplash.com/photo-1574620583726-1076b13f195d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "National Cricket Team Wins Series",
          body: "The Tigers have clinched the ODI series against the visiting team with a stunning performance in the final match at Mirpur.",
          image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "New Startups Booming in Bangladesh",
          body: "The startup ecosystem in Bangladesh is witnessing rapid growth with fintech and edtech leading the way in attracting foreign investment.",
          image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Winter Festival Begins in Sylhet",
          body: "The annual traditional winter festival has kicked off in Sylhet, attracting tourists from all over the country to enjoy pithas and folk music.",
          image: "https://images.unsplash.com/photo-1473691955023-da1c49c95c78?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Tech Giants Eye Data Centers in Kaliakair",
          body: "Several global tech giants are in talks to establish large-scale data centers in the Hi-Tech Park at Kaliakair.",
          image: "https://images.unsplash.com/photo-1558494949-ef2bb6db8744?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Education Reform Policy Drafted",
          body: "A new education policy draft focuses on skill-based learning and digitizing the classroom experience across rural schools.",
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Export Earnings Hit Record High",
          body: "Bangladesh's export earnings have surpassed all previous records this fiscal year, driven by the RMG sector.",
          image: "https://images.unsplash.com/photo-1595855779344-99ce8b86851b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Green Energy Projects Launched",
          body: "Five new solar power plants were inaugurated today as part of the country's commitment to renewable energy transitions.",
          image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Book Fair Preparations Underway",
          body: "The Ekushey Boi Mela preparations are in full swing. This year, the fair will cover a larger area to accommodate more publishers.",
          image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        },
        {
          title: "Smart City Pilot Project Started",
          body: "A smart city pilot project has started in Khulna to improve waste management and traffic control using IoT sensors.",
          image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          authorId: author.id
        }
      ];

      await News.bulkCreate(newsData);
      console.log("Database seeded!");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware: Authorize Roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// --- ROUTES ---

// AUTH
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    let assignedRole = role === 'author' ? 'author' : 'user';
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword, role: assignedRole });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEWS (Public Read)
app.get("/news", async (req, res) => {
  try {
    const { _sort, _order } = req.query;
    let order = [['createdAt', 'DESC']];

    // Basic mapping for json-server style params if still used
    if (_sort === 'id') order = [['id', _order === 'desc' ? 'DESC' : 'ASC']];

    const news = await News.findAll({
      include: [{ model: User, as: "author", attributes: ["id", "name"] }],
      order
    });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/news/:id", async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, {
      include: [{ model: User, as: "author", attributes: ["id", "name"] }]
    });
    if (!news) return res.status(404).json({ message: "Not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEWS (Protected: Create/Edit/Delete)
app.post("/news", authenticateToken, authorizeRoles("author", "admin"), async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const newNews = await News.create({
      title,
      body,
      image,
      authorId: req.user.id
    });
    res.status(201).json(newNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/news/:id", authenticateToken, authorizeRoles("author", "admin"), async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    // Check ownership
    if (req.user.role === 'author' && news.authorId !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own news" });
    }

    await news.update(req.body);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/news/:id", authenticateToken, authorizeRoles("author", "admin"), async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    // Check ownership
    if (req.user.role === 'author' && news.authorId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own news" });
    }

    await news.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USERS (Admin Only)
app.get("/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Return without password
    const { password: _, ...userWithoutPass } = newUser.toJSON();
    res.status(201).json(userWithoutPass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/users/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    await user.destroy(); // Cascade deletes news because of relationship
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// COMMENTS
app.get("/news/:newsId/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { newsId: req.params.newsId },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/news/:newsId/comments", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const newComment = await Comment.create({
      text,
      newsId: req.params.newsId,
      userId: req.user.id
    });

    // Fetch with user info to return complete object
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [{ model: User, as: "user", attributes: ["id", "name"] }]
    });

    res.status(201).json(commentWithUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.sync({ force: false }); // Set force: true to drop/recreate tables (CAREFUL)
    console.log("Database connected & synced");
    await seedDatabase();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});
