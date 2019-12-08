<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="FinalGame.WebForm1" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Login: In Queso Emergency</title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <input id="Username" name="Username" type="text" placeholder="username"/>
            <br/>
            <input id="Password" name="Password" type="password" placeholder="password"/>
            <br/>
            <button id="enter" name="Submit" onclick="checkCred()">Submit</button>
            <br/>
            <span id="feedback"> </span>
            <script type="text/javascript">
                function checkCred() {
                    document.getElementById('user').value = document.getElementById('Username').value;
                    document.getElementById('pass').value = document.getElementById('Password').value;

                    var login = '<%=playID %>';
                    if (login != null) {
                        user.value = null;
                        pass.value = null;
                        Console.log("YES! I WORK!"); //DEBUGGING ONLY!
                        window.location.assign("target URL") //ENTER THE REDIRECTED URL HERE!!!
                    } else {
                        decument.getElementById('feedback').value = "Oops, failed attempt!";
                    }
                }
            </script>
            <asp:HiddenField ID="user" runat="server" Value=""/>
            <asp:HiddenField ID="pass" runat="server" Value="" />
        </div>
    </form>
</body>
</html>