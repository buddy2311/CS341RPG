using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

using MySql.Data.MySqlClient;
using System.Configuration;


namespace ControllerCS341
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        Controller cont = new Controller();

        public MainWindow()
        {
            InitializeComponent();
        }

        private void TestSelector_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

        }

        private void PrintData_TextChanged(object sender, TextChangedEventArgs e)
        {

        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            switch (TestSelector.SelectedIndex)
            {

                case 0:
                    PrintData.Text = cont.PrintUsernames();
                    break;

                case 1:
                    PrintData.Text = cont.PrintUserID(PrintData.Text);
                    break;

                case 2:
                    PrintData.Text = cont.Login(SignIn_User.Text, SignIn_Pass.Text);
                    break;

                case -1:
                    PrintData.Text = "Select an activity.";
                    break;
                default:
                    break;


            }
        }
    }


    public class Controller
    {
        Database db = new Database();

        private string connectionStringToDB = ConfigurationManager.ConnectionStrings["MySQLDB"].ConnectionString;

        public string PrintUsernames()
        {
            MySqlConnection conn = new MySqlConnection(connectionStringToDB);
            conn.Open();

            MySqlCommand mycmd = new MySqlCommand("SELECT username FROM GameData", conn);
            MySqlDataReader reader = mycmd.ExecuteReader();
            int count = reader.FieldCount;


            StringBuilder str = new StringBuilder();

            while (reader.Read())
            {
                for (int i = 0; i < count; i++)
                {
                    str.Append(reader.GetValue(i) + " ");
                }
                str.Append("\n");
            }


            conn.Close();
            return str + "";
        }

        public string PrintUserID(string username)
        {
            MySqlConnection conn = new MySqlConnection(connectionStringToDB);
            conn.Open();

            //select id from gamedata where username
            MySqlCommand mycmd = new MySqlCommand("SELECT playerid FROM GameData WHERE username = @user", conn);
            mycmd.Parameters.Add(new MySqlParameter("user", username));
            MySqlDataReader reader = mycmd.ExecuteReader();
            int count = reader.FieldCount;

            StringBuilder str = new StringBuilder();

            while (reader.Read())
            {
                for (int i = 0; i < count; i++)
                {
                    str.Append(reader.GetValue(i) + " ");
                }
                str.Append("\n");
            }

            conn.Close();
            string convertedstring = str + "";
            if (convertedstring == "")
            {
                return "That username wasnt found";
            }
            return convertedstring;
        }

        public string Login(string username, string password)
        {
            MySqlConnection conn = new MySqlConnection(connectionStringToDB);
            conn.Open();

            MySqlCommand login = new MySqlCommand("SELECT password FROM GameData WHERE username = @user", conn);
            login.Parameters.Add(new MySqlParameter("user", username));
            MySqlDataReader reader = login.ExecuteReader();
            int count = reader.FieldCount;

            StringBuilder str = new StringBuilder();

            while (reader.Read())
            {
                for (int i = 0; i < count; i++)
                {
                    str.Append(reader.GetValue(i));
                }
            }

            string temppass = str + "";

            if(temppass.Equals(password))
            {
                conn.Close();
                return username + " is logged in";
            }
            else if(!temppass.Equals("") && !temppass.Equals(password))
            {
                conn.Close();
                return "password is incorrect";
            }
            else if(temppass.Equals(""))
            {
                conn.Close();
                return "This user does not exist";
            }
            conn.Close();
            return "idk what happened man";


        }

    }

    public class Database
    {




    }

}

