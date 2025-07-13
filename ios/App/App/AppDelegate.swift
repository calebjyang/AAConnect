import UIKit
import Capacitor
import FirebaseCore
import GoogleSignIn

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // --- Firebase Initialization Debug Prints ---
        print("Before FirebaseApp.configure()")
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
        }
        print("After FirebaseApp.configure()")
        
        // --- Google Sign-In Configuration ---
        print("Configuring Google Sign-In...")
        // Get the client ID from GoogleService-Info.plist
        if let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
           let plist = NSDictionary(contentsOfFile: path),
           let clientId = plist["CLIENT_ID"] as? String {
            print("Google Client ID found: \(clientId)")
            GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientId)
        } else {
            print("ERROR: Could not find Google Client ID in GoogleService-Info.plist")
        }
        // --------------------------------------------
        
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) { }
    func applicationDidEnterBackground(_ application: UIApplication) { }
    func applicationWillEnterForeground(_ application: UIApplication) { }
    func applicationidBecomeActive(_ application: UIApplication) { }
    func applicationWillTerminate(_ application: UIApplication) { }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Handle Google Sign-In URL
        if url.scheme?.hasPrefix("com.googleusercontent.apps") == true {
            return GIDSignIn.sharedInstance.handle(url)
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }
    
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
