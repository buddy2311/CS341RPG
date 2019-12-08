using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;

using System.Configuration;     
using MySql.Data.MySqlClient;
using System.Text;

namespace FinalGame
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        public string name;
        public string entry;
        public string playID;


        ConnectUI controller = new Controller();

        protected void Page_Load(object sender, EventArgs e)
        {
            name = user.Value;
            entry = pass.Value;
        }

        public void Login()
        {
            playID = controller.Login(name, entry);
        }

    }
}

public abstract class ConnectUI
{
    public abstract string Login(string u, string p);
    public abstract string Hash(string input);
}

public class Controller : ConnectUI
{
    ConnectData database = new Database();

    public override string Login(string u, string p)
    {
        p = Hash(p);

        string playID = database.CheckUser(u, p);
        return playID;

    }

    public override string Hash(string input)
    {
        var hash = new SHA1Managed().ComputeHash(Encoding.UTF8.GetBytes(input));
        var sb = new StringBuilder(hash.Length * 2);
        foreach (byte b in hash)
        {
            sb.Append(b.ToString("x2"));
        }
        return sb.ToString();

    }
}

/// <summary>
/// Interface that connects Controller to Database
/// </summary>
public abstract class ConnectData
{
    public abstract string CheckUser(string user, string pass);
    public abstract string GetStats(string id);
    public abstract void UpdateStats(string stats, string id);
    public abstract string[] GetState(string id);
    public abstract string[] GetInventory(string id);
    public abstract void AddToInventory(string item, string id);
    public abstract void RemoveFromInventory(string item, string id);
    public abstract string LoadProgress(string id);
    public abstract void Save(string id, string progress);
    
}

public class Database : ConnectData
{
    //Connection to the database
    private readonly string connectionStringToDB = ConfigurationManager.ConnectionStrings["MySQLDB"].ConnectionString;

    /// <summary>
    /// Checks if the info exists in the database.
    /// </summary>
    /// <param name="user">the username</param>
    /// <param name="pass">the pass</param>
    /// <returns>returns true if it exists, false otherwise</returns>
    public override string CheckUser(string user, string pass)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("SELECT playerid FROM GameData WHERE username = @use AND password = @pass", databoop);
        cmd.Parameters.Add(new MySqlParameter("use", user));
        cmd.Parameters.Add(new MySqlParameter("pass", pass));

        MySqlDataReader dataReader = cmd.ExecuteReader();
        string userExists = dataReader.GetString(0);
        databoop.Close();

        return userExists;
    }

    /// <summary>
    /// Returns the stats of the user as a string
    /// </summary>
    /// <param name="id">the user id</param>
    /// <returns>stats as a string</returns>
    public override string GetStats(string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("SELECT stats FROM GameData WHERE playerid = @id", databoop);
        cmd.Parameters.Add(new MySqlParameter("id", id));

        MySqlDataReader dataReader = cmd.ExecuteReader();
        databoop.Close();

        string stats = dataReader.GetString(0);

        return stats;

    }

    /// <summary>
    /// Updates the stats of the inventory, as it has changed
    /// </summary>
    /// <param name="stats">the updated stats</param>
    /// <param name="id">the user id</param>
    public override void UpdateStats(string stats, string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("UPDATE GameData SET stats = @pro WHERE playerid = @unique", databoop);
        cmd.Parameters.Add(new MySqlParameter("pro", stats));
        cmd.Parameters.Add(new MySqlParameter("unique", id));

        cmd.ExecuteReader();
        databoop.Close();
    }

    /// <summary>
    /// Returns the stats from the database into a string array
    /// </summary>
    /// <param name="id">the user id</param>
    /// <returns>a string array with each stat</returns>
    public override string[] GetState(string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("SELECT * FROM PlayerStats WHERE uid = @id", databoop);
        cmd.Parameters.Add(new MySqlParameter("id", id));

        MySqlDataReader dataReader = cmd.ExecuteReader();

        int count = dataReader.FieldCount;
        String[] stats = new string[count];
        while (dataReader.Read())
        {
            for (int i = 0; i < count; i++)
            {
                stats[i] = dataReader.GetString(i);
            }
        }

        databoop.Close();
        return stats;
    }

    /// <summary>
    /// Once the user is signed in, an inventory (table) is created to track items
    /// </summary>
    /// <param name="stats">The stats help create instances of the items in the new table</param>
    /// <param name="id">The user id</param>
    public override string[] GetInventory(string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("SELECT iid FROM InventoryDatabase WHERE uid = @user", databoop);
        cmd.Parameters.Add(new MySqlParameter("user", id));

        MySqlDataReader dataReader = cmd.ExecuteReader();

        int count = dataReader.FieldCount;
        String[] items = new string[count];
        while (dataReader.Read())
        {
            for (int i = 0; i < count; i++)
            {
                items[i] = dataReader.GetString(i);
            }
        }

        databoop.Close();
        return items;

    }

    /// <summary>
    /// Adds an item to the inventory
    /// </summary>
    /// <param name="item">the item being added</param>
    /// <param name="id"> user id that collected the item</param>
    public override void AddToInventory(string item, string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();

        MySqlCommand cmd = new MySqlCommand("INSERT INTO InventoryDatabase(uid, iid) VALUES (@id,@item)", databoop);
        cmd.Parameters.Add(new MySqlParameter("id", id));
        cmd.Parameters.Add(new MySqlParameter("item", item));

        cmd.ExecuteReader();
        databoop.Close();
    }

    /// <summary>
    /// Removes an item from the inventory as the user uses it
    /// </summary>
    /// <param name="item">the item being removed</param>
    /// <param name="id"> The user id</param>
    public override void RemoveFromInventory(string item, string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();

        MySqlCommand cmd = new MySqlCommand("DELETE FROM InventoryDatabase WHERE uid = @id AND iid = @item LIMIT 1", databoop);
        cmd.Parameters.Add(new MySqlParameter("id", id));
        cmd.Parameters.Add(new MySqlParameter("item", item));

        cmd.ExecuteReader();
        databoop.Close();
    }

    /// <summary>
    /// Loads the story progress of a user
    /// </summary>
    /// <param name="id"></param>
    /// <returns> progress so far</returns>
    public override string LoadProgress(string id)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("SELECT storyprogress FROM GameData WHERE playerid = @unique", databoop);
        cmd.Parameters.Add(new MySqlParameter("unique", id));

        MySqlDataReader dataReader = cmd.ExecuteReader();
        string progress = dataReader.GetString(0);
        databoop.Close();

        return progress;
    }

    /// <summary>
    /// Updates the story progress of a user
    /// </summary>
    /// <param name="id"> the user id</param>
    /// <param name="progress"> the new progress</param>
    public override void Save(string id, string progress)
    {
        MySqlConnection databoop = new MySqlConnection(connectionStringToDB);
        databoop.Open();
        MySqlCommand cmd = new MySqlCommand("UPDATE GameData SET storyprogress = @pro WHERE playerid = @unique", databoop);
        cmd.Parameters.Add(new MySqlParameter("pro", progress));
        cmd.Parameters.Add(new MySqlParameter("unique", id));

        cmd.ExecuteReader();
        databoop.Close();

    }
}