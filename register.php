<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require 'db.php'; // Include the database connection file

    // Sanitize and validate input data
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    
    // Check if all fields are provided
    if (!empty($name) && !empty($email) && !empty($password)) {

        // Check if the email already exists
        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                // Email already exists
                echo json_encode(["success" => false, "message" => "Email already registered"]);
            } else {
                // Hash the password
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);

                // Prepare SQL query to insert new user
                $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
                $stmt = $conn->prepare($sql);

                if ($stmt) {
                    $stmt->bind_param("sss", $name, $email, $hashed_password);
                    if ($stmt->execute()) {
                        echo json_encode(["success" => true, "message" => "Registration successful"]);
                    } else {
                        echo json_encode(["success" => false, "message" => "Error: Could not register user"]);
                    }
                    $stmt->close();
                } else {
                    echo json_encode(["success" => false, "message" => "Database error during registration"]);
                }
            }
        } else {
            echo json_encode(["success" => false, "message" => "Database query failed"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
