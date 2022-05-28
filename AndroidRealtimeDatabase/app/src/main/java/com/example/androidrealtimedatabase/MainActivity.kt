package com.example.androidrealtimedatabase

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val balance = findViewById<TextView>(R.id.textViewBalance)
        SocketHandler.setSocket()

        val mSocket = SocketHandler.getSocket()
        mSocket.connect()
        mSocket.emit("balance")

        mSocket.on("balance"){ args ->
            if (args[0] != null){
                val mBalance = args[0] as Int

                runOnUiThread{
                    balance.text = mBalance.toString()
                }
        }

        }

    }
}